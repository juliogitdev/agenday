
package com.agenday.core.repository.Plan;
import com.agenday.core.domain.model.Plan.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface PlanRepository extends JpaRepository<Plan, UUID> {
    @Query("""
        SELECT DISTINCT p
        FROM Plan p
        LEFT JOIN FETCH p.limits
        WHERE p.id = :id 
    """)
    Optional<Plan> findByIdWithLimits(@Param("id") UUID id);

    @Query("""
        SELECT DISTINCT p
        FROM Plan p
        LEFT JOIN FETCH p.limits
    """)
    List<Plan> findAllWithLimits();
}