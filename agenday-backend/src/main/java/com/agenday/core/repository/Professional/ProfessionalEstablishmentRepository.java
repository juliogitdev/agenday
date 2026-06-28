package com.agenday.core.repository.Professional;

import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfessionalEstablishmentRepository extends JpaRepository<ProfessionalEstablishment, UUID> {

    Optional<ProfessionalEstablishment> findByIdAndIsActiveTrue(UUID id);

    // Evita duplicar o mesmo vínculo ativo ou pendente no salão
    boolean existsByEstablishmentIdAndProfessionalUserEmailAndIsActiveTrue(UUID establishmentId, String email);

    List<ProfessionalEstablishment> findByEstablishmentIdAndIsActiveTrue(UUID establishmentId);
    @Query("SELECT pe FROM ProfessionalEstablishment pe " +
            "JOIN FETCH pe.professional p " +
            "JOIN FETCH p.user u " +
            "WHERE pe.establishment.id = :establishmentId " +
            "AND pe.isActive = true")
    List<ProfessionalEstablishment> findByEstablishmentIdAndIsActiveTrueWithDetails(
            @Param("establishmentId") UUID establishmentId
    );
}
