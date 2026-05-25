
package com.agenday.establishment.application.service;
import com.agenday.establishment.application.dto.ProfessionalRequest;
import com.agenday.establishment.application.dto.ProfessionalResponse;
import com.agenday.establishment.domain.model.Plan;
import com.agenday.establishment.domain.model.Professional;
import com.agenday.establishment.domain.model.ProfessionalSubscription;
import com.agenday.establishment.domain.model.SubscriptionStatus;
import com.agenday.establishment.mapper.ProfessionalMapper;
import com.agenday.establishment.repository.PlanRepository;
import com.agenday.establishment.repository.ProfessionalRepository;
import com.agenday.establishment.repository.ProfessionalSubscriptionRepository;
import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.RoleRepository;
import com.agenday.iam.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;

@Service
public class ProfessionalService {
    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final RoleRepository roleRepository;
    private final PlanRepository planRepository;
    private final ProfessionalSubscriptionRepository subscriptionRepository;

    public ProfessionalService(
            UserRepository userRepository,
            ProfessionalRepository professionalRepository,
            RoleRepository roleRepository,
            PlanRepository planRepository,
            ProfessionalSubscriptionRepository subscriptionRepository
    ) {
        this.userRepository = userRepository;
        this.professionalRepository = professionalRepository;
        this.roleRepository = roleRepository;
        this.planRepository = planRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    public ProfessionalResponse promoteClientToProfessional(String emailUser, ProfessionalRequest request) {
        User user = getUserByEmail(emailUser);
        if(professionalRepository.findByUser(user).isPresent())
            throw new IllegalArgumentException( "User already is professional");
        
        Plan plan = planRepository.findById(request.planId()).orElseThrow(() ->new RuntimeException("Plan not found"));
        Professional professional = new Professional();
        professional.setUser(user);
        professional.setBio(request.bio());
        professional.setWorkingSince(request.workingSince());
        professional.setInstagramUrl(request.instagramUrl());
        professional.setSpecializedIn(request.specializedIn());

        professional = professionalRepository.save(professional);
        ProfessionalSubscription subscription = new ProfessionalSubscription();
        subscription.setProfessional(professional);
        subscription.setPlan(plan);
		subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStartedAt(OffsetDateTime.now());
        subscription.setExpiresAt(OffsetDateTime.now().plusDays(plan.getDurationDays()));
        subscriptionRepository.save(subscription);

        Role roleProfessional = roleRepository.findByName( "ROLE_PROFESSIONAL" ).orElseThrow(() -> new RuntimeException("Role not found"));
        user.getRoles().add(roleProfessional);
        userRepository.save(user);
        return ProfessionalMapper.toDTO(professional);
    }

    public ProfessionalResponse getMyProfessionalProfile(String emailUser) { 
        return ProfessionalMapper.toDTO(getProfessional(emailUser));
    }

    public ProfessionalResponse updateMyProfessionalProfile(String emailUser,ProfessionalRequest request) {
        Professional professional = getProfessional(emailUser);
        professional.setBio(request.bio());
        professional.setWorkingSince(request.workingSince());
        professional.setInstagramUrl(request.instagramUrl());
        professional.setSpecializedIn(request.specializedIn());
        return ProfessionalMapper.toDTO(professionalRepository.save(professional));
    }

    public void deleteMyProfessionalProfile(String emailUser) {
        User user = getUserByEmail(emailUser);
        Professional professional = getProfessional(emailUser);
		professionalRepository.delete(professional);
        user.getRoles().removeIf(role ->role.getName().equals("ROLE_PROFESSIONAL"));
        userRepository.save(user);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->new UsernameNotFoundException("User not found"));
    }

    private Professional getProfessional( String email){
        User user = getUserByEmail(email);
        return professionalRepository.findByUser(user).orElseThrow(() ->new UsernameNotFoundException("Professional not found"));
    }
}