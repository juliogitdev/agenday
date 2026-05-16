package com.agenday.establishment.application.service;

import com.agenday.establishment.application.dto.EstablishmentRequest;
import com.agenday.establishment.application.dto.EstablishmentResponse;
import com.agenday.establishment.domain.model.Establishment;
import com.agenday.establishment.mapper.EstablishmentMapper;
import com.agenday.establishment.repository.EstablishmentRepository;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class EstablishmentService {

    private final EstablishmentRepository establishmentRepository;
    private final UserRepository userRepository;

    public EstablishmentService(
            EstablishmentRepository establishmentRepository,
            UserRepository userRepository
    ){
        this.establishmentRepository = establishmentRepository;
        this.userRepository = userRepository;
    }

    public EstablishmentResponse createEstablishment(String emailUser, EstablishmentRequest establishmentRequest){
        User user = userRepository.findByEmail(emailUser).orElseThrow(() -> new UsernameNotFoundException(("User not found")));

        Establishment newEstablishment = EstablishmentMapper.toEntity(establishmentRequest);

        newEstablishment.setOwner(user);


        return EstablishmentMapper.toDTO(establishmentRepository.save(newEstablishment));
    }

    public List<EstablishmentResponse> getAll(){
        return establishmentRepository.findAll()
                .stream()
                .map(establishment -> EstablishmentMapper.toDTO(establishment))
                .collect(Collectors.toList());
    }

    public EstablishmentResponse updateEstablishment(
            UUID id,
            String emailUser,
            EstablishmentRequest request){

            Establishment establishment = establishmentRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Establishment not found"));

        if (!establishment.getOwner().getEmail().equals(emailUser)) {
            throw new AccessDeniedException("You don't have permission to edit this establishment");
        }

        EstablishmentMapper.updateEntity(establishment, request);

        return EstablishmentMapper.toDTO(establishmentRepository.save(establishment));
    }

}
