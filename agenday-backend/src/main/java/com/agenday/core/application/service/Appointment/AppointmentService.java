package com.agenday.core.application.service.Appointment;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.Appointment.AppointmentRequest;
import com.agenday.core.application.dto.Appointment.AppointmentResponse;
import com.agenday.core.domain.enums.AppointmentStatus;
import com.agenday.core.domain.model.Appointment.Appointment;
import com.agenday.core.domain.model.catalogItem.CatalogItem;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.domain.model.Professional.ProfessionalSchedule;
import com.agenday.iam.domain.model.User;
import com.agenday.core.mapper.Appointment.AppointmentMapper;
import com.agenday.core.repository.Appointment.AppointmentRepository;
import com.agenday.core.repository.CatalogItem.CatalogItemRepository;
import com.agenday.core.repository.Professional.ProfessionalEstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalScheduleRepository;
import com.agenday.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ProfessionalEstablishmentRepository establishmentRepository;
    private final CatalogItemRepository catalogItemRepository;
    private final ProfessionalScheduleRepository scheduleRepository;
    private final UserRepository userRepository; // Para buscar o cliente logado

    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request, Authentication authentication) {

        // 1. Identificar o cliente logado via Token JWT
        String customerEmail = authentication.getName();
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new BusinessException(
                        "USER_NOT_FOUND", "Usuário cliente não encontrado.", HttpStatus.NOT_FOUND
                ));

        // 2. Buscar o vínculo do profissional e garantir que está ativo
        ProfessionalEstablishment establishment = establishmentRepository.findByIdAndIsActiveTrue(request.professionalEstablishmentId())
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_NOT_FOUND", "Profissional não está ativo ou vinculado a este estabelecimento.", HttpStatus.NOT_FOUND
                ));

        // 3. Buscar o serviço no catálogo para descobrir a duração
        CatalogItem catalogItem = catalogItemRepository.findById(request.catalogItemId())
                .orElseThrow(() -> new BusinessException(
                        "SERVICE_NOT_FOUND", "O serviço selecionado não existe no catálogo.", HttpStatus.NOT_FOUND
                ));

        // 4. CÁLCULO MATEMÁTICO DO END_TIME
        // Pegao startTime enviado pelo front e somamos a duração em minutos do serviço
        LocalDateTime startTime = request.startTime();
        LocalDateTime endTime = startTime.plusMinutes(catalogItem.getDefaultDurationMinutes());

        // 5. VALIDAÇÃO 1: O horário bate com a Jornada de Trabalho (Schedule) do profissional?
        LocalTime appointmentStartLocalTime = startTime.toLocalTime();
        LocalTime appointmentEndLocalTime = endTime.toLocalTime();

        // Busca se existe um turno cadastrado para aquele dia da semana que cubra o horário do agendamento
        boolean worksAtThisTime = scheduleRepository.existsScheduleConflict(
                request.professionalEstablishmentId(),
                startTime.getDayOfWeek(),
                appointmentStartLocalTime,
                appointmentEndLocalTime
        );

        if (!worksAtThisTime) {
            throw new BusinessException(
                    "OUTSIDE_WORK_HOURS",
                    "O profissional não trabalha neste horário ou neste dia da semana.",
                    HttpStatus.BAD_REQUEST
            );
        }

        // 6. VALIDAÇÃO 2: Trava de Concorrência (Conflito de agendamentos existentes)
        boolean hasConflict = appointmentRepository.existsAppointmentConflict(
                request.professionalEstablishmentId(),
                startTime,
                endTime
        );

        if (hasConflict) {
            throw new BusinessException(
                    "APPOINTMENT_CONFLICT",
                    "Este horário já foi reservado por outro cliente. Escolha outro momento.",
                    HttpStatus.CONFLICT
            );
        }

        // 7. Construir a Entidade e Persistir
        Appointment appointment = Appointment.builder()
                .customer(customer)
                .professionalEstablishment(establishment)
                .catalogItem(catalogItem)
                .startTime(startTime)
                .endTime(endTime)
                .status(AppointmentStatus.SCHEDULED) // Nasce agendado
                .notes(request.notes())
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return AppointmentMapper.toDTO(savedAppointment);
    }

    /**
     * CANCELAR AGENDAMENTO
     * Regra de Negócio: Clientes podem cancelar seus próprios horários.
     * Profissionais ou Donos também podem cancelar horários agendados com eles.
     */
    @Transactional
    public void cancelAppointment(UUID appointmentId, Authentication authentication) {
        String loggedUserEmail = authentication.getName();

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new BusinessException(
                        "APPOINTMENT_NOT_FOUND", "Agendamento não encontrado.", HttpStatus.NOT_FOUND
                ));

        // Impede cancelar algo que já foi concluído ou já está cancelado
        if (appointment.getStatus() != AppointmentStatus.SCHEDULED) {
            throw new BusinessException(
                    "INVALID_STATUS_CHANGE",
                    "Apenas agendamentos confirmados (SCHEDULED) podem ser cancelados.",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Validação de Segurança (Ownership): Quem está cancelando é o dono do agendamento ou o prestador?
        String customerEmail = appointment.getCustomer().getEmail();
        String professionalEmail = appointment.getProfessionalEstablishment().getProfessional().getUser().getEmail();
        String ownerEmail = appointment.getProfessionalEstablishment().getEstablishment().getOwner().getEmail();

        boolean isAuthorized = loggedUserEmail.equals(customerEmail) ||
                loggedUserEmail.equals(professionalEmail) ||
                loggedUserEmail.equals(ownerEmail);

        if (!isAuthorized) {
            throw new BusinessException(
                    "FORBIDDEN_ACTION", "Você não tem permissão para cancelar este agendamento.", HttpStatus.FORBIDDEN
            );
        }

        // Soft Delete
        appointment.setStatus(AppointmentStatus.CANCELED);
    }

    /**
     * MEUS AGENDAMENTOS (Visão do Cliente)
     * Retorna o histórico completo de tudo que o cliente logado marcou no app.
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getCustomerAppointments(Authentication authentication) {
        String customerEmail = authentication.getName();
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new BusinessException(
                        "USER_NOT_FOUND", "Usuário não encontrado.", HttpStatus.NOT_FOUND
                ));

        return appointmentRepository.findByCustomerIdAndIsActiveTrueOrderByStartTimeDesc(customer.getId())
                .stream()
                .map(AppointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * AGENDA DO PROFISSIONAL (Visão do Painel/Calendário)
     * Retorna os agendamentos de um profissional dentro de um período (ex: o dia ou a semana atual).
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getProfessionalAgenda(
            Authentication authentication,
            UUID professionalEstabId,
            LocalDateTime start,
            LocalDateTime end) {

        // 1. Buscar o vínculo para extrair as entidades donas do contexto
        ProfessionalEstablishment establishmentLink = establishmentRepository.findByIdAndIsActiveTrue(professionalEstabId)
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_ESTABLISHMENT_NOT_FOUND",
                        "Vínculo profissional-estabelecimento não encontrado ou inativo.",
                        HttpStatus.NOT_FOUND
                ));

        // 2. Extrair o e-mail de quem está fazendo a requisição (Token JWT)
        String loggedUserEmail = authentication.getName();

        // 3. Descobrir os e-mails dos donos legítimos daquela agenda através do banco
        String professionalEmail = establishmentLink.getProfessional().getUser().getEmail();
        String establishmentOwnerEmail = establishmentLink.getEstablishment().getOwner().getEmail();

        // 4. VALIDAÇÃO DE IDENTIDADE PURA
        // Quem está logado é o profissional da agenda ou o dono do estabelecimento?
        boolean isTheProfessional = loggedUserEmail.equals(professionalEmail);
        boolean isTheEstablishmentOwner = loggedUserEmail.equals(establishmentOwnerEmail);

        if (!isTheProfessional && !isTheEstablishmentOwner) {
            throw new BusinessException(
                    "FORBIDDEN_ACTION",
                    "Ação inválida. Você não tem permissão para visualizar esta agenda.",
                    HttpStatus.FORBIDDEN
            );
        }

        // 5. Retorna os agendamentos do período para montar o calendário
        return appointmentRepository.findByProfessionalEstablishmentIdAndStartTimeBetweenAndIsActiveTrue(
                        professionalEstabId, start, end
                )
                .stream()
                .map(AppointmentMapper::toDTO)
                .collect(Collectors.toList());
    }
}