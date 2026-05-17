package com.agenday.establishment.repository;

import com.agenday.establishment.domain.model.Professional;
import com.agenday.iam.domain.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProfessionalRepository extends JpaRepository<Professional, UUID> {
    Optional<Professional> findByUser(User user);
}
