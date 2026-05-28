
package com.agenday.core.domain.model;
import com.agenday.common.domain.model.BaseEntity;
import com.agenday.core.domain.model.Plan.Plan;
import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "professional_subscriptions")
@Data
public class ProfessionalSubscription extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "professional_id",
        nullable = false
    )
    private Professional professional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "plan_id",
        nullable = false
    )

    private Plan plan;

    @Enumerated(EnumType.STRING)  private SubscriptionStatus status;
    @Column(name = "started_at") private OffsetDateTime startedAt;
    @Column(name = "expires_at")  private OffsetDateTime expiresAt;
    @Column(name = "last_payment_at")  private OffsetDateTime lastPaymentAt;
    @Column(name = "gateway_subscription_id") private String gatewaySubscriptionId;

}