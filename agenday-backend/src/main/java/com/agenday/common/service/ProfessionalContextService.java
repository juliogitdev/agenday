package com.agenday.common.service;

import com.agenday.common.dto.OwnerContext;
import com.agenday.common.exception.BusinessException;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.core.domain.model.Professional.ProfessionalSubscription;
import com.agenday.core.repository.Establishment.EstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalRepository;
import com.agenday.core.repository.Professional.ProfessionalSubscriptionRepository;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

public class ProfessionalContextService {

    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final EstablishmentRepository establishmentRepository;
    private final ProfessionalSubscriptionRepository subscriptionRepository;

    /**
     * CONTEXTO 1: Focado no Perfil do Profissional (Agenda, Horários, etc.)
     */
    @Transactional(readOnly = true)
    public ProfessionalSubscription obterAssinaturaAtivaValidada(String emailUser) {
        User user = buscarUsuarioPorEmail(emailUser);

        Professional professional = professionalRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(
                        "NOT_A_PROFESSIONAL",
                        "Você precisa ter um perfil profissional para acessar este recurso.",
                        HttpStatus.FORBIDDEN)
                );

        return subscriptionRepository.findByProfessionalWithPlanAndLimits(professional)
                .orElseThrow(() -> new BusinessException(
                        "PLAN_NOT_FOUND",
                        "Nenhum plano ativo encontrado para este profissional.",
                        HttpStatus.BAD_REQUEST)
                );
    }

    /**
     * CONTEXTO 2: Focado no Dono do Estabelecimento (Gestão de Equipe, Serviços, etc.)
     * 🌟 É AQUI QUE ELE MORA!
     */
    @Transactional(readOnly = true)
    public OwnerContext obterContextoDoDono(String emailUser) {
        User user = buscarUsuarioPorEmail(emailUser);

        // 1. Busca o estabelecimento onde este usuário é o dono real (owner)
        Establishment establishment = establishmentRepository.findByOwner(user)
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado para este gestor.",
                        HttpStatus.NOT_FOUND)
                );

        // 2. Busca a assinatura atrelada ao perfil profissional dele para sabermos os limites
        Professional professional = professionalRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(
                        "NOT_A_PROFESSIONAL",
                        "Perfil profissional não configurado para este gestor.",
                        HttpStatus.FORBIDDEN)
                );

        ProfessionalSubscription subscription = subscriptionRepository.findByProfessionalWithPlanAndLimits(professional)
                .orElseThrow(() -> new BusinessException(
                        "PLAN_NOT_FOUND",
                        "Nenhum plano ativo encontrado para este estabelecimento.",
                        HttpStatus.BAD_REQUEST)
                );

        // Retorna o pacote de dados mastigado (Record)
        return new OwnerContext(user, establishment, subscription);
    }

    /**
     * Método privado utilitário para reaproveitar a busca do usuário nesta classe
     */
    private User buscarUsuarioPorEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(
                        "USER_NOT_FOUND",
                        "Usuário não encontrado.",
                        HttpStatus.NOT_FOUND)
                );
    }

}
