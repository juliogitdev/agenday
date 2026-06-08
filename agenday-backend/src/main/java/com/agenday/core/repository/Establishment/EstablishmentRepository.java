
package com.agenday.core.repository.Establishment;
import com.agenday.core.domain.model.Establishment.Establishment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EstablishmentRepository extends JpaRepository<Establishment, UUID> {
    @Query("SELECT e FROM Establishment e JOIN FETCH e.owner WHERE e.id = :id")
    Optional<Establishment> findByIdWithOwner(@Param("id") UUID id);

    long countByOwnerId(UUID ownerId);

    @Query("SELECT e FROM Establishment e JOIN FETCH e.owner WHERE e.owner.email = :email")
    List<Establishment> findByOwnerEmail(String email);

    boolean existsByNumberPhone(String numberPhone);
}
