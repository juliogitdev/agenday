
package com.agenday.core.repository;
import com.agenday.core.domain.model.Professional;
import com.agenday.core.domain.model.ProfessionalSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ProfessionalSubscriptionRepository
    extends JpaRepository<ProfessionalSubscription, UUID> {
    Optional<ProfessionalSubscription> findByProfessional(Professional professional);
}
