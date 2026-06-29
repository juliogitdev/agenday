package com.agenday.core.repository.Professional;

import com.agenday.core.domain.enums.LinkStatus;
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

    @Query("SELECT pe FROM ProfessionalEstablishment pe " +
            "JOIN FETCH pe.establishment e " +
            "WHERE pe.professional.user.email = :email " +
            "AND pe.status = :status")
    List<ProfessionalEstablishment> findPendingInvitationsByProfessionalEmail(
            @Param("email") String email,
            @Param("status") LinkStatus status
    );

    //Verificar se existe convite pendente
    boolean existsByEstablishmentIdAndProfessionalUserEmailAndStatus(
            UUID establishmentId,
            String email,
            LinkStatus status
    );

    Optional<ProfessionalEstablishment> findFirstByEstablishmentIdAndProfessionalUserEmailOrderByCreatedAtDesc(
            UUID establishmentId,
            String professionalEmail
    );
}
