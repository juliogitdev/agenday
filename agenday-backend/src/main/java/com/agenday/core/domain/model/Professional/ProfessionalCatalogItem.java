package com.agenday.core.domain.model.Professional;

import com.agenday.common.domain.model.BaseEntity;
import com.agenday.core.domain.model.catalogItem.CatalogItem;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "professional_catalog_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_professional_establishment_catalog_item",
                        columnNames = {"professional_establishment_id", "catalog_item_id"}
                )
        }
)
@Data
public class ProfessionalCatalogItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_establishment_id", nullable = false) // 👈 A mágica está aqui!
    private ProfessionalEstablishment professionalEstablishment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalog_item_id", nullable = false)
    private CatalogItem catalogItem;

    @Column(name = "custom_price")
    private BigDecimal customPrice;

    @Column(name = "custom_duration_minutes")
    private Integer customDurationMinutes;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}