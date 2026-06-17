package com.agenday.core.application.service.Professional;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.Professional.ProfessionalScheduleRequest;
import com.agenday.core.application.dto.Professional.ProfessionalScheduleResponse;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.domain.model.Professional.ProfessionalSchedule;
import com.agenday.core.mapper.Professional.ProfessionalScheduleMapper;
import com.agenday.core.repository.Professional.ProfessionalEstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessionalScheduleService {

    private final ProfessionalScheduleRepository scheduleRepository;
    private final ProfessionalEstablishmentRepository establishmentRepository;

    @Transactional
    public ProfessionalScheduleResponse createSchedule(ProfessionalScheduleRequest request, Authentication authentication) {

        // Extrair informações de segurança do token JWT
        String userEmail = authentication.getName();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        // Clientes comuns não criam jornadas de trabalho
        if (!roles.contains("ROLE_PROFESSIONAL")) {
            throw new BusinessException(
                    "ACCESS_DENIED",
                    "Clientes não têm permissão para gerenciar agendas profissionais.",
                    HttpStatus.FORBIDDEN
            );
        }

        // Validação básica: Hora de fim deve ser após a hora de início
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BusinessException(
                    "INVALID_TIME_RANGE",
                    "O horário de término do turno deve ser após o horário de início.",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Buscar o vínculo ativo
        ProfessionalEstablishment establishment = establishmentRepository.findByIdAndIsActiveTrue(request.professionalEstablishmentId())
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_ESTABLISHMENT_NOT_FOUND",
                        "Vínculo profissional-estabelecimento não encontrado ou inativo.",
                        HttpStatus.NOT_FOUND
                ));

        // Se for um Profissional, garante que ele só edita a si mesmo
        if (roles.contains("ROLE_PROFESSIONAL")) {
            String professionalEmail = establishment.getProfessional().getUser().getEmail();
            if (!userEmail.equals(professionalEmail)) {
                throw new BusinessException(
                        "FORBIDDEN_ACTION",
                        "Ação inválida. Você só pode gerenciar a sua própria jornada de trabalho.",
                        HttpStatus.FORBIDDEN
                );
            }
        }


        // Trava de Segurança Contra Sobreposição
        boolean hasConflict = scheduleRepository.existsScheduleConflict(
                request.professionalEstablishmentId(),
                request.dayOfWeek(),
                request.startTime(),
                request.endTime()
        );

        if (hasConflict) {
            throw new BusinessException(
                    "SCHEDULE_OVERLAP_CONFLICT",
                    "Este turno entra em conflito com uma jornada já cadastrada para este profissional no mesmo dia.",
                    HttpStatus.CONFLICT
            );
        }

        // Mapear DTO para Entidade utilizando o Mapper e Salvar
        ProfessionalSchedule schedule = ProfessionalScheduleMapper.toEntity(request);
        schedule.setProfessionalEstablishment(establishment);

        ProfessionalSchedule savedSchedule = scheduleRepository.save(schedule);

        // 7. Retornar o DTO de Resposta via Mapper
        return ProfessionalScheduleMapper.toDTO(savedSchedule);
    }

    @Transactional(readOnly = true)
    public List<ProfessionalScheduleResponse> getSchedulesByEstablishment(UUID professionalEstabId) {

        return scheduleRepository.findByProfessionalEstablishmentIdAndIsActiveTrue(professionalEstabId)
                .stream()
                .map(ProfessionalScheduleMapper::toDTO)
                .collect(Collectors.toList());
    }
}