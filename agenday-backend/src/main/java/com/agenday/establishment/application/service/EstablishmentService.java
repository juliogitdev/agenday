package com.agenday.establishment.application.service;

import com.agenday.establishment.application.dto.EstablishmentRequest;
import com.agenday.establishment.application.dto.EstablishmentResponse;
import com.agenday.establishment.domain.model.Address;
import com.agenday.establishment.domain.model.Establishment;
import com.agenday.establishment.mapper.AddressMapper;
import com.agenday.establishment.mapper.EstablishmentMapper;
import com.agenday.establishment.repository.EstablishmentRepository;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.UserRepository;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;


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
        User user = userRepository.findByEmail(emailUser).orElseThrow(() -> new IllegalArgumentException(("User not found")));

        Establishment newEstablishment = EstablishmentMapper.toEntity(establishmentRequest);

        newEstablishment.setOwner(user);


        return EstablishmentMapper.toDTO(establishmentRepository.save(newEstablishment));
    }

}
