package com.agenday.establishment.application.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.RoleRepository;
import com.agenday.iam.repository.UserRepository;
import com.agenday.establishment.application.dto.ProfessionalRequest;
import com.agenday.establishment.application.dto.ProfessionalResponse;
import com.agenday.establishment.domain.model.Professional;
import com.agenday.establishment.mapper.ProfessionalMapper;
import com.agenday.establishment.repository.ProfessionalRepository;

@Service
public class ProfessionalService {
    
    private final UserRepository userRepository;
    private final ProfessionalRepository ProfessionalRepository;
    private final RoleRepository roleRepository;

    public ProfessionalService(
        UserRepository userRepository, 
        ProfessionalRepository ProfessionalRepository,
        RoleRepository roleRepository
    ){
        this.userRepository = userRepository;
        this.ProfessionalRepository = ProfessionalRepository;
        this.roleRepository = roleRepository;
    }

 
    public ProfessionalResponse promoteClientToProfessional(String emailUser, ProfessionalRequest request){
        User user = userRepository.findByEmail(emailUser).orElseThrow(() -> new UsernameNotFoundException(("User not found")));



        if(user.getRoles().stream()
            .anyMatch(role -> role.getName().equals("ROLE_PROFESSIONAL")))
        {
            throw new IllegalArgumentException("User is already a professional");
        }

        

        Professional newProfessional = new Professional();
        newProfessional.setUser(user);

        newProfessional.setBio(request.bio());
        newProfessional.setProfileImageUrl(request.profileImageUrl());

        Role roleProfessional = roleRepository.findByName("ROLE_PROFESSIONAL")
                .orElseThrow(()-> new RuntimeException("Erro ao buscar pela role 'ROLE_PROFESSIONAL'"));

        user.getRoles().add(roleProfessional);
        return ProfessionalMapper.toDTO(ProfessionalRepository.save(newProfessional));
    }

    public ProfessionalResponse getMyProfessionalProfile(String emailUser){
        User user = userRepository.findByEmail(emailUser).orElseThrow(() -> new UsernameNotFoundException(("User not found")));
        Professional professional = ProfessionalRepository.findByUser(user).orElseThrow(() -> new UsernameNotFoundException(("Professional not found")));
        return ProfessionalMapper.toDTO(professional);
    }
}

