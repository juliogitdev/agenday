package com.agenday.core.application.service.Professional;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.Professional.InvitationActionRequest;
import com.agenday.core.application.dto.Professional.ProfessionalEstablishmentRequest;
import com.agenday.core.application.dto.Professional.ProfessionalEstablishmentResponse;
import com.agenday.core.application.dto.Professional.ProfessionalInvitationResponse;
import com.agenday.core.domain.enums.LinkStatus;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.mapper.Professional.ProfessionalEstablishmentMapper;
import com.agenday.core.repository.Establishment.EstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalEstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessionalEstablishmentService {

    private final ProfessionalEstablishmentRepository linkRepository;
    private final EstablishmentRepository establishmentRepository;
    private final ProfessionalRepository professionalRepository;

    @Transactional
    public ProfessionalEstablishmentResponse linkProfessional(ProfessionalEstablishmentRequest request, Authentication authentication) {

        String loggedUserEmail = authentication.getName();

        // 1. Verificar se o estabelecimento existe
        Establishment establishment = establishmentRepository.findById(request.establishmentId())
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        // 2. VALIDAÇÃO DE DONO
        String establishmentOwnerEmail = establishment.getOwner().getEmail();
        if (!loggedUserEmail.equals(establishmentOwnerEmail)) {
            throw new BusinessException(
                    "FORBIDDEN_ACTION",
                    "Ação inválida. Você não é o proprietário deste estabelecimento.",
                    HttpStatus.FORBIDDEN
            );
        }

        // 3. Verificar se o profissional existe
        Professional professional = professionalRepository.findByUserEmail(request.emailProfessional())
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_NOT_FOUND",
                        "Nenhum profissional cadastrado com o e-mail fornecido.",
                        HttpStatus.NOT_FOUND
                ));

        // 4. VALIDAÇÃO DE VÍNCULO
        Optional<ProfessionalEstablishment> existingLinkOpt = linkRepository
                .findFirstByEstablishmentIdAndProfessionalUserEmailOrderByCreatedAtDesc(
                        request.establishmentId(),
                        request.emailProfessional()
                );

        if (existingLinkOpt.isPresent()) {
            ProfessionalEstablishment existingLink = existingLinkOpt.get();
            LinkStatus currentStatus = existingLink.getStatus();

            // Se estiver ATIVO (Aceito)
            if (currentStatus == LinkStatus.ACTIVE) {
                throw new BusinessException(
                        "ALREADY_LINKED",
                        "Este profissional já possui um vínculo ativo com este estabelecimento.",
                        HttpStatus.CONFLICT
                );
            }

            // Se estiver PENDENTE
            if (currentStatus == LinkStatus.PENDING) {
                throw new BusinessException(
                        "PENDING_INVITATION_EXISTS",
                        "Já existe um convite pendente para este profissional. Aguarde ele responder.",
                        HttpStatus.CONFLICT
                );
            }

            // Se estiver INATIVO (e não for REJECTED)
            if (currentStatus != LinkStatus.REJECTED) {
                throw new BusinessException(
                        "INACTIVE_LINK",
                        "Este profissional está inativo neste estabelecimento. Utilize o fluxo de reativação.",
                        HttpStatus.CONFLICT
                );
            }
        }

        // 5. Construir e salvar o NOVO vínculo
        ProfessionalEstablishment link = new ProfessionalEstablishment();
        link.setEstablishment(establishment);
        link.setProfessional(professional);

        if (request.emailProfessional().equals(loggedUserEmail)) {
            link.setStatus(LinkStatus.ACTIVE);
            link.setLinkedAt(LocalDateTime.now());
        } else {
            link.setStatus(LinkStatus.ACTIVE);
            link.setLinkedAt(null);
        }

        ProfessionalEstablishment savedLink = linkRepository.save(link);
        return ProfessionalEstablishmentMapper.toDTO(savedLink);
    }


    @Transactional(readOnly = true)
    public List<ProfessionalEstablishmentResponse> getProfessionalsByEstablishment(UUID establishmentId, Authentication authentication) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND", "Estabelecimento não encontrado.", HttpStatus.NOT_FOUND));

        String loggedUserEmail = authentication.getName();
        boolean isOwner = loggedUserEmail.equals(establishment.getOwner().getEmail());

        // Dono: enxerga todos os profissionais vinculados
        if (isOwner) {
            return linkRepository.findByEstablishmentIdAndIsActiveTrueWithDetails(establishmentId)
                    .stream().map(ProfessionalEstablishmentMapper::toDTO).collect(Collectors.toList());
        }

        // Não-dono: precisa ter vínculo ativo e só enxerga o próprio
        boolean isLinked = linkRepository
                .existsByEstablishmentIdAndProfessionalUserEmailAndIsActiveTrue(establishmentId, loggedUserEmail);
        if (!isLinked) {
            throw new BusinessException(
                    "FORBIDDEN_ACTION", "Você não tem vínculo com este estabelecimento.", HttpStatus.FORBIDDEN);
        }

        return linkRepository.findByEstablishmentIdAndIsActiveTrueWithDetails(establishmentId)
                .stream()
                .filter(link -> link.getProfessional().getUser().getEmail().equals(loggedUserEmail))
                .map(ProfessionalEstablishmentMapper::toDTO)
                .collect(Collectors.toList());
    }
    /**
     * ACEITAR OU REJEITAR CONVITE
     * Permite ao profissional aceitar ou rejeitar um convite de estabelecimento
     */
    @Transactional
    public ProfessionalEstablishmentResponse handleInvitation(
            InvitationActionRequest request,
            Authentication authentication) {

        String professionalEmail = authentication.getName();

        // 1. Buscar o vínculo
        ProfessionalEstablishment link = linkRepository.findById(request.linkId())
                .orElseThrow(() -> new BusinessException(
                        "INVITATION_NOT_FOUND",
                        "Convite não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        // 2. Validar se o profissional logado é o dono do convite
        if (!link.getProfessional().getUser().getEmail().equals(professionalEmail)) {
            throw new BusinessException(
                    "FORBIDDEN_ACTION",
                    "Você não tem permissão para responder a este convite.",
                    HttpStatus.FORBIDDEN
            );
        }

        // 3. Validar se o convite está pendente
        if (link.getStatus() != LinkStatus.PENDING) {
            throw new BusinessException(
                    "INVALID_INVITATION_STATUS",
                    "Este convite já foi respondido.",
                    HttpStatus.BAD_REQUEST
            );
        }

        // 4. Processar a ação
        if (Boolean.TRUE.equals(request.accepted())) {
            link.setStatus(LinkStatus.ACTIVE);
            link.setLinkedAt(LocalDateTime.now());
        } else {
            link.setStatus(LinkStatus.REJECTED);
        }

        ProfessionalEstablishment updatedLink = linkRepository.save(link);
        return ProfessionalEstablishmentMapper.toDTO(updatedLink);
    }

    /**
     * LISTAR CONVITES PENDENTES
     * Retorna todos os convites pendentes para o profissional logado
     */
    @Transactional(readOnly = true)
    public List<ProfessionalInvitationResponse> getPendingInvitations(Authentication authentication) {
        String professionalEmail = authentication.getName();

        List<ProfessionalEstablishment> invitations = linkRepository
                .findPendingInvitationsByProfessionalEmail(professionalEmail, LinkStatus.PENDING);

        return invitations.stream()
                .map(invitation -> {
                    Establishment establishment = invitation.getEstablishment();
                    return new ProfessionalInvitationResponse(
                            invitation.getId(),
                            establishment.getId(),
                            establishment.getName(),
                            establishment.getAddress(),
                            invitation.getStatus(),
                            invitation.getCreatedAt() // Data em que foi criado
                    );
                })
                .collect(Collectors.toList());
    }
}