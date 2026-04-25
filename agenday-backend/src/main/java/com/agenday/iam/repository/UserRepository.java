package com.agenday.iam.repository;

import com.agenday.iam.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
