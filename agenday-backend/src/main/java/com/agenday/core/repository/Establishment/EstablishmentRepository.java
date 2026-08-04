
package com.agenday.core.repository.Establishment;
import com.agenday.core.domain.model.Establishment.Establishment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    List<Establishment> findByOwnerEmailAndIsActiveTrue(String email);

    boolean existsByNumberPhone(String numberPhone);

    Optional<Establishment> findByIdAndIsActiveTrue(UUID id);

    Optional<Establishment> findBySlugAndIsActiveTrue(String slug);

    boolean existsBySlug(String slug);

    Page<Establishment> findByIsActiveTrue(Pageable pageable);

    Page<Establishment> findByIsActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("""
    SELECT DISTINCT pe.establishment FROM ProfessionalEstablishment pe
    WHERE pe.professional.user.email = :email
      AND pe.status = com.agenday.core.domain.enums.LinkStatus.ACTIVE
      AND pe.isActive = true
      AND pe.establishment.isActive = true
    """)
    List<Establishment> findActiveLinkedByProfessionalEmail(@Param("email") String email);
}
