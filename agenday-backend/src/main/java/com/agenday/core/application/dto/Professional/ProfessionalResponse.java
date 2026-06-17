package com.agenday.core.application.dto.Professional;

import com.agenday.core.domain.enums.SubscriptionStatus;
import java.time.LocalDate;
import java.util.UUID;

public record ProfessionalResponse(
    UUID id,
    String fullName,
    String email,
    String bio,
    LocalDate workingSince,
    String instagramUrl,
    String specializedIn,
    long establishmentCount, // O contador que vai ajudar o frontend
    String currentPlanName,
    SubscriptionStatus subscriptionStatus
) {}