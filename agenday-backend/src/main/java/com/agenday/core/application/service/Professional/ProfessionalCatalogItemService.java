package com.agenday.core.application.service.Professional;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.Professional.ProfessionalCatalogItemRequest;
import com.agenday.core.application.dto.Professional.ProfessionalCatalogItemResponse;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.core.domain.model.Professional.ProfessionalCatalogItem;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.domain.model.Professional.ProfessionalSubscription;
import com.agenday.core.domain.model.catalogItem.CatalogItem;
import com.agenday.core.mapper.Professional.ProfessionalCatalogItemMapper;
import com.agenday.core.repository.CatalogItem.CatalogItemRepository;
import com.agenday.core.repository.Professional.ProfessionalCatalogItemRepository;
import com.agenday.core.repository.Professional.ProfessionalEstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalRepository;
import com.agenday.core.repository.Professional.ProfessionalSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfessionalCatalogItemService {

    private final ProfessionalCatalogItemRepository professionalCatalogItemRepository;
    private final CatalogItemRepository catalogItemRepository;
    private final ProfessionalEstablishmentRepository professionalEstablishmentRepository;
    private final ProfessionalRepository professionalRepository;
    private final ProfessionalSubscriptionRepository subscriptionRepository;

    @Transactional
    public ProfessionalCatalogItemResponse createAssociation(String emailUser, ProfessionalCatalogItemRequest request) {

        // 1. Busca o perfil profissional logado (o Owner)
        Professional professional = professionalRepository.findByUserEmail(emailUser)
                .orElseThrow(() -> new BusinessException(
                        "PROFESSIONAL_NOT_FOUND",
                        "Perfil profissional não encontrado para este usuário.",
                        HttpStatus.NOT_FOUND
                ));

        // 2. Busca e garante a assinatura ativa
        ProfessionalSubscription subscription = subscriptionRepository.findByProfessionalWithPlanAndLimits(professional)
                .orElseThrow(() -> new BusinessException(
                        "SUBSCRIPTION_NOT_FOUND",
                        "Nenhuma assinatura de plano encontrada para este perfil profissional.",
                        HttpStatus.NOT_FOUND
                ));

        // 3. Busca o vínculo do funcionário
        ProfessionalEstablishment professionalEstablishment = professionalEstablishmentRepository.findById(request.professionalEstablishmentId())
                .orElseThrow(() -> new BusinessException(
                        "RELATION_NOT_FOUND",
                        "Vínculo do profissional não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        // 4. Trava de Segurança: Valida se quem está logado realmente é o dono daquele salão
        Establishment establishment = professionalEstablishment.getEstablishment();
        if (!establishment.getOwner().equals(professional.getUser())) {
            throw new BusinessException(
                    "ACCESS_DENIED",
                    "Você não tem permissão para gerenciar este estabelecimento.",
                    HttpStatus.FORBIDDEN
            );
        }

        // 5. Trava de Unicidade: Evita duplicidade
        if (professionalCatalogItemRepository.existsByProfessionalEstablishmentIdAndCatalogItemId(
                request.professionalEstablishmentId(), request.catalogItemId())) {
            throw new BusinessException(
                    "CONFLICT",
                    "Este profissional já está vinculado a este serviço.",
                    HttpStatus.CONFLICT
            );
        }

        // 6. Busca o item do catálogo global
        CatalogItem catalogItem = catalogItemRepository.findById(request.catalogItemId())
                .orElseThrow(() -> new BusinessException(
                        "CATALOG_ITEM_NOT_FOUND",
                        "Serviço não encontrado no catálogo.",
                        HttpStatus.NOT_FOUND
                ));

        // 7. Mapeia, salva e retorna
        ProfessionalCatalogItem professionalCatalogItem = ProfessionalCatalogItemMapper.toEntity(request, professionalEstablishment, catalogItem);
        return ProfessionalCatalogItemMapper.toResponseDTO(professionalCatalogItemRepository.save(professionalCatalogItem));
    }
}