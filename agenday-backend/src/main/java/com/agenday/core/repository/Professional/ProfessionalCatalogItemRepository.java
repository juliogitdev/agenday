package com.agenday.core.repository.Professional;

import com.agenday.core.domain.model.Professional.ProfessionalCatalogItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("""
        SELECT pci FROM ProfessionalCatalogItem pci
        JOIN FETCH pci.professionalEstablishment pe
        JOIN FETCH pe.professional p
        JOIN FETCH pci.catalogItem ci
        WHERE pe.establishment.id = :establishmentId
          AND pe.isActive = true
          AND ci.isActive = true
        """)
    List<ProfessionalCatalogItem> findActiveByEstablishmentId(@Param("establishmentId") UUID establishmentId);
}
