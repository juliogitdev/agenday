package com.agenday.core.application.service.Professional;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.Professional.ProfessionalEstablishmentRequest;
import com.agenday.core.application.dto.Professional.ProfessionalEstablishmentResponse;
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

        // Extrair os dados de segurança do Dono que está logado
        String loggedUserEmail = authentication.getName();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();



        // Verificar se o estabelecimento existe
        Establishment establishment = establishmentRepository.findById(request.establishmentId())
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        // VALIDAÇÃO DE DONO (Ownership Check)
        // Verifica se o e-mail de quem está logado é idêntico ao e-mail do dono do salão no banco
        String establishmentOwnerEmail = establishment.getOwner().getEmail();
        if (!loggedUserEmail.equals(establishmentOwnerEmail)) {
            throw new BusinessException(
                    "FORBIDDEN_ACTION",
                    "Ação inválida. Você não é o proprietário deste estabelecimento.",
                    HttpStatus.FORBIDDEN
            );
        }

        // Verificar se o profissional que será convidado existe no sistema
        Professional professional = professionalRepository.findByUserEmail(request.emailProfessional())
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_NOT_FOUND",
                        "Nenhum profissional cadastrado com o e-mail fornecido.",
                        HttpStatus.NOT_FOUND
                ));

        // Trava de duplicidade
        boolean alreadyLinked = linkRepository.existsByEstablishmentIdAndProfessionalUserEmailAndIsActiveTrue(
                request.establishmentId(), request.emailProfessional()
        );

        if (alreadyLinked) {
            throw new BusinessException(
                    "ALREADY_LINKED",
                    "Este profissional já possui um vínculo ativo ou pendente com este estabelecimento.",
                    HttpStatus.CONFLICT
            );
        }

        // Construir e salvar o vínculo
        ProfessionalEstablishment link = new ProfessionalEstablishment();
        link.setEstablishment(establishment);
        link.setProfessional(professional);
        if(request.emailProfessional().equals(loggedUserEmail)){
            link.setStatus(LinkStatus.ACTIVE);
            link.setLinkedAt(LocalDateTime.now());
        }else{
            link.setStatus(LinkStatus.ACTIVE);
            link.setLinkedAt(null);
        }

        ProfessionalEstablishment savedLink = linkRepository.save(link);

        return ProfessionalEstablishmentMapper.toDTO(savedLink);
    }


    @Transactional(readOnly = true)
    public List<ProfessionalEstablishmentResponse> getSchedulesByEstablishment(UUID establishmentId, Authentication authentication) {
        // Verificar se o estabelecimento existe
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        String loggedUserEmail = authentication.getName();

        // Verifica se o e-mail de quem está logado é idêntico ao e-mail do dono do salão no banco
        String establishmentOwnerEmail = establishment.getOwner().getEmail();
        if (!loggedUserEmail.equals(establishmentOwnerEmail)) {
            throw new BusinessException(
                    "FORBIDDEN_ACTION",
                    "Ação inválida. Você não é o proprietário deste estabelecimento.",
                    HttpStatus.FORBIDDEN
            );
        }

        return linkRepository.findByEstablishmentIdAndIsActiveTrue(establishmentId)
                .stream()
                .map(ProfessionalEstablishmentMapper::toDTO)
                .collect(Collectors.toList());
    }
}