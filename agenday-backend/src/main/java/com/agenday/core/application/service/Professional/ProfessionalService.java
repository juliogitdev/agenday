package com.agenday.core.application.service.Professional;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.Professional.ClientPromoteToProfessionalRequest;
import com.agenday.core.application.dto.Professional.ProfessionalResponse;
import com.agenday.core.application.dto.Professional.ProfessionalUpdateRequest;
import com.agenday.core.domain.model.Plan.Plan;
import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.core.domain.model.Professional.ProfessionalSubscription;
import com.agenday.core.domain.enums.SubscriptionStatus;
import com.agenday.core.repository.Plan.PlanRepository;
import com.agenday.core.repository.Professional.ProfessionalRepository;
import com.agenday.core.repository.Professional.ProfessionalSubscriptionRepository;
import com.agenday.core.repository.Establishment.EstablishmentRepository;
import com.agenday.iam.application.dto.AuthResponse;
import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.infrastructure.security.JwtService;
import com.agenday.iam.repository.RoleRepository;
import com.agenday.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfessionalService {

    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final RoleRepository roleRepository;
    private final PlanRepository planRepository;
    private final ProfessionalSubscriptionRepository subscriptionRepository;
    private final EstablishmentRepository establishmentRepository; // Injetado para contar unidades
    private final JwtService jwtService;

    @Transactional
    public AuthResponse promoteClientToProfessional(String emailUser, ClientPromoteToProfessionalRequest request) {
        User user = getUserByEmail(emailUser);
        validateProfessional(user);
        Plan plan = getPlan(request.planId());

        Professional professional = new Professional();
        professional.setUser(user);
        professional = professionalRepository.save(professional);

        createSubscription(professional, plan);
        addProfessionalRole(user);
        userRepository.save(user);

        String accessToken = jwtService.generateToken(user);
        return new AuthResponse(accessToken, "Bearer");
    }

    // NOVO: Retorna o perfil completo do profissional com o contador de estabelecimentos
    @Transactional(readOnly = true)
    public ProfessionalResponse getMyProfessionalProfile(String emailUser) {
        Professional professional = professionalRepository.findByUserEmail(emailUser)
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_NOT_FOUND",
                        "Perfil profissional não encontrado para este usuário.",
                        HttpStatus.NOT_FOUND
                ));

        ProfessionalSubscription subscription = subscriptionRepository.findByProfessionalWithPlanAndLimits(professional)
                .orElseThrow(() -> new BusinessException(
                        "SUBSCRIPTION_NOT_FOUND",
                        "Nenhuma assinatura de plano encontrada para este perfil profissional.",
                        HttpStatus.NOT_FOUND
                ));

        // Conta quantos estabelecimentos pertencem ao usuário dono do perfil
        long establishmentCount = establishmentRepository.countByOwnerId(professional.getUser().getId());

        return new ProfessionalResponse(
                professional.getId(),
                professional.getUser().getFullName(),
                professional.getUser().getEmail(),
                professional.getBio(),
                professional.getWorkingSince(),
                professional.getInstagramUrl(),
                professional.getSpecializedIn(),
                establishmentCount,
                subscription.getPlan().getName(),
                subscription.getStatus()
        );
    }

    // NOVO: Atualiza os dados dinâmicos do perfil
    @Transactional
    public ProfessionalResponse updateMyProfessionalProfile(String emailUser, ProfessionalUpdateRequest request) {
        Professional professional = professionalRepository.findByUserEmail(emailUser)
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_NOT_FOUND",
                        "Perfil profissional não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        professional.setBio(request.bio());
        professional.setWorkingSince(request.workingSince());
        professional.setInstagramUrl(request.instagramUrl());
        professional.setSpecializedIn(request.specializedIn());

        professional = professionalRepository.save(professional);

        ProfessionalSubscription subscription = subscriptionRepository.findByProfessional(professional)
                .orElseThrow(() -> new BusinessException(
                        "SUBSCRIPTION_NOT_FOUND",
                        "Assinatura não localizada.",
                        HttpStatus.NOT_FOUND
                ));

        long establishmentCount = establishmentRepository.countByOwnerId(professional.getUser().getId());

        return new ProfessionalResponse(
                professional.getId(),
                professional.getUser().getFullName(),
                professional.getUser().getEmail(),
                professional.getBio(),
                professional.getWorkingSince(),
                professional.getInstagramUrl(),
                professional.getSpecializedIn(),
                establishmentCount,
                subscription.getPlan().getName(),
                subscription.getStatus()
        );
    }

    // NOVO: Altera o plano de assinatura do profissional de forma segura
    @Transactional
    public void changeSubscriptionPlan(String emailUser, UUID newPlanId) {
        Professional professional = professionalRepository.findByUserEmail(emailUser)
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_NOT_FOUND",
                        "Perfil profissional não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        Plan newPlan = planRepository.findById(newPlanId)
                .orElseThrow(() -> new BusinessException(
                        "PLAN_NOT_FOUND",
                        "O plano informado não existe.",
                        HttpStatus.NOT_FOUND
                ));

        // Busca a assinatura atual para desativar ou atualizar
        ProfessionalSubscription currentSubscription = subscriptionRepository.findByProfessional(professional)
                .orElse(null);

        if (currentSubscription != null) {
            // Se o plano novo for igual ao atual, não precisa reprocessar
            if (currentSubscription.getPlan().getId().equals(newPlanId)) {
                throw new BusinessException(
                        "SAME_PLAN",
                        "Você já possui uma assinatura ativa para este plano.",
                        HttpStatus.BAD_REQUEST
                );
            }
            // Encerra ou remove a assinatura antiga conforme sua regra (aqui mudamos o status ou deletamos)
            subscriptionRepository.delete(currentSubscription);
            subscriptionRepository.flush(); // Sincroniza a remoção antes de criar a nova
        }

        // Cria a nova assinatura vinculada ao novo plano
        createSubscription(professional, newPlan);
    }

    private void validateProfessional(User user) {
        if (professionalRepository.findByUser(user).isPresent())
            throw new BusinessException(
                    "ALREADY_A_PROFESSIONAL",
                    "Este usuário já possui um perfil profissional ativo.",
                    HttpStatus.CONFLICT
            );
    }

    private Plan getPlan(UUID planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new BusinessException(
                        "PLAN_NOT_FOUND",
                        "Plano não encontrado no sistema.",
                        HttpStatus.NOT_FOUND
                ));
    }

    private void addProfessionalRole(User user) {
        Role roleProfessional = roleRepository.findByName("ROLE_PROFESSIONAL")
                .orElseThrow(() -> new BusinessException(
                        "ROLE_NOT_FOUND",
                        "Permissão profissional (ROLE_PROFESSIONAL) não configurada.",
                        HttpStatus.INTERNAL_SERVER_ERROR
                ));
        if (user.getRoles().stream().noneMatch(role -> role.getName().equals("ROLE_PROFESSIONAL"))) {
            user.getRoles().add(roleProfessional);
        }
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(
                        "USER_NOT_FOUND",
                        "Usuário base não encontrado.",
                        HttpStatus.NOT_FOUND
                ));
    }

    private void createSubscription(Professional professional, Plan plan) {
        OffsetDateTime now = OffsetDateTime.now();
        ProfessionalSubscription subscription = new ProfessionalSubscription();
        subscription.setProfessional(professional);
        subscription.setPlan(plan);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStartedAt(now);
        subscription.setExpiresAt(plan.getDurationDays() == -1 ? now.plusYears(50) : now.plusDays(plan.getDurationDays()));
        subscriptionRepository.save(subscription);
    }
}