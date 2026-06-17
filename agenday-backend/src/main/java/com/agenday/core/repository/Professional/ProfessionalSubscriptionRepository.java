
package com.agenday.core.repository.Professional;
import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.core.domain.model.Professional.ProfessionalSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ProfessionalSubscriptionRepository
    extends JpaRepository<ProfessionalSubscription, UUID> {
    Optional<ProfessionalSubscription> findByProfessional(Professional professional);

    @Query("SELECT s FROM ProfessionalSubscription s " +
           "JOIN FETCH s.plan p " +
           "JOIN FETCH p.limits " +
           "WHERE s.professional = :professional")
    Optional<ProfessionalSubscription> findByProfessionalWithPlanAndLimits(@Param("professional") Professional professional);
}
