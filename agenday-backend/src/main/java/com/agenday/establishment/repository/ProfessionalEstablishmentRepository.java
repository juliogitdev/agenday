package com.agenday.establishment.repository;

import com.agenday.establishment.domain.model.Establishment;
import com.agenday.establishment.domain.model.Professional;
import com.agenday.establishment.domain.model.ProfessionalEstablishment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProfessionalEstablishmentRepository extends JpaRepository<ProfessionalEstablishment, UUID> {

    List<ProfessionalEstablishment> findByEstablishment(Establishment establishment);

    List<ProfessionalEstablishment> findByProfessional(Professional professional);

    boolean existsByProfessionalAndEstablishment(Professional professional, Establishment establishment);
}
