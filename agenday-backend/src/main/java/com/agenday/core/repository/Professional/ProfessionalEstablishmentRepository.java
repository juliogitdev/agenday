package com.agenday.core.repository.Professional;

import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProfessionalEstablishmentRepository extends JpaRepository<ProfessionalEstablishment, UUID> {
}
