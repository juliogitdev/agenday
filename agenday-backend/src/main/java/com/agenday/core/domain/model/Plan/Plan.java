
package com.agenday.core.domain.model.Plan;
import com.agenday.common.domain.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "plans")
@Data
@EqualsAndHashCode(callSuper = false)
public class Plan extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToMany (
        mappedBy = "plan",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<PlanLimit> limits;

    @Column(nullable = false, unique = true)  private String name;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(nullable = false)  private BigDecimal price;
    @Column(name = "duration_days")  private Integer durationDays;
    @Column(name = "is_active")  private Boolean isActive = true;
}
