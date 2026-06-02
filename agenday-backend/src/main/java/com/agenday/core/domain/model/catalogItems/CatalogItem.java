package com.agenday.core.domain.model.catalogItems;

import com.agenday.common.domain.model.BaseEntity;
import com.agenday.core.domain.model.Establishment.Establishment;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "catalog_items")
@EqualsAndHashCode(callSuper = false)
public class CatalogItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "establishment_id", nullable = false)
    private Establishment establishment;

    @Column(name = "name",nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "default_price", nullable = false)
    private BigDecimal defaultPrice;

    @Column(name = "default_duration_minutes", nullable = false)
    private Integer defaultDurationMinutes;

}
