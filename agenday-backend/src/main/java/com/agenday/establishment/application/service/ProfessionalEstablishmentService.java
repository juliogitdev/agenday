package com.agenday.establishment.application.service;

import com.agenday.establishment.application.dto.ProfessionalEstablishmentRequest;
import com.agenday.establishment.application.dto.ProfessionalEstablishmentResponse;
import com.agenday.establishment.application.exception.ResourceNotFoundException;
import com.agenday.establishment.domain.enums.LinkStatus;
import com.agenday.establishment.domain.model.Establishment;
import com.agenday.establishment.domain.model.Professional;
import com.agenday.establishment.domain.model.ProfessionalEstablishment;
import com.agenday.establishment.mapper.ProfessionalEstablishmentMapper;
import com.agenday.establishment.repository.EstablishmentRepository;
import com.agenday.establishment.repository.ProfessionalEstablishmentRepository;
import com.agenday.establishment.repository.ProfessionalRepository;
import com.agenday.iam.domain.model.User;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProfessionalEstablishmentService {

    private final ProfessionalEstablishmentRepository professionalEstablishmentRepository;
    private final ProfessionalRepository professionalRepository;
    private final EstablishmentRepository establishmentRepository;

    public ProfessionalEstablishmentService(
            ProfessionalEstablishmentRepository professionalEstablishmentRepository,
            ProfessionalRepository professionalRepository,
            EstablishmentRepository establishmentRepository
    ){
        this.professionalEstablishmentRepository = professionalEstablishmentRepository;
        this.professionalRepository = professionalRepository;
        this.establishmentRepository = establishmentRepository;
    }

    public ProfessionalEstablishmentResponse inviteProfessional(String ownerEmail, ProfessionalEstablishmentRequest request){

        Professional professionalOwner = professionalRepository.findByUserEmail(ownerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Pr    ofessional not found!"));
        Establishment establishment = establishmentRepository.findById(request.establishmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Establishment not found"));

        User userOwner = professionalOwner.getUser();

        if(!userOwner.getId().equals(establishment.getOwner().getId())){
            throw new AccessDeniedException("You don't have permission to invite this establishment");
        }

        Professional professionalInvited = professionalRepository.findByUserEmail(request.emailProfessional())
                .orElseThrow(() -> new UsernameNotFoundException("Professional not found!"));

        ProfessionalEstablishment professionalEstablishment = new ProfessionalEstablishment();
        professionalEstablishment.setEstablishment(establishment);
        professionalEstablishment.setProfessional(professionalInvited);
        professionalEstablishment.setStatus(LinkStatus.PENDING);

        professionalEstablishment = professionalEstablishmentRepository.save(professionalEstablishment);

        return ProfessionalEstablishmentMapper.toDTO(professionalEstablishment);
    }
}
