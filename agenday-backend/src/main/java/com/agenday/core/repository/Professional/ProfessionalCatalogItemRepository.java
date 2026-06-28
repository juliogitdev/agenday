package com.agenday.core.repository.Professional;

import com.agenday.core.domain.model.Professional.ProfessionalCatalogItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfessionalCatalogItemRepository extends JpaRepository<ProfessionalCatalogItem, UUID> {

    List<ProfessionalCatalogItem> findByCatalogItemId(UUID catalogItemId);
    List<ProfessionalCatalogItem> findByProfessionalEstablishmentIdAndIsActiveTrue(UUID professionalEstablishmentId);
    boolean existsByProfessionalEstablishmentIdAndCatalogItemId(UUID professionalEstablishmentId, UUID catalogItemId);
    Optional<ProfessionalCatalogItem> findByProfessionalEstablishmentIdAndCatalogItemIdAndIsActiveTrue(
            UUID professionalEstablishmentId,
            UUID catalogItemId
    );
    List<ProfessionalCatalogItem> findByCatalogItemIdAndIsActiveTrue(UUID catalogItemId);


    boolean existsByProfessionalEstablishmentIdAndCatalogItemIdAndIsActiveTrue(
            UUID professionalEstablishmentId,
            UUID catalogItemId
    );
}
