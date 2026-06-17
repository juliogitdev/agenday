
package com.agenday.core.domain.model.Plan;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table (
    name = "plan_limits",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"plan_id", "limit_key"}
        )
    }
)
@Data
public class PlanLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(
            name = "plan_id",
            nullable = false
    )
    private Plan plan;
    @Column(name = "limit_key", nullable = false)  private String key;
    @Column(name = "limit_value", nullable = false) private String value;
}