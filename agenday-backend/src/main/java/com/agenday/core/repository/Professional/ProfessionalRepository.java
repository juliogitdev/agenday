package com.agenday.core.repository.Professional;

import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.iam.domain.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProfessionalRepository extends JpaRepository<Professional, UUID> {
    Optional<Professional> findByUser(User user);
    Optional<Professional> findByUserEmail(String email);
}
