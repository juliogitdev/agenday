package com.agenday.core.application.dto;

import java.time.LocalDate;
import java.util.UUID;

public record ProfessionalResponse (
        UUID id,
        String userName,
        String profileImageUrl,
        String bio,
        LocalDate workingSince,
        String instagramUrl,
        String specializedIn,
        String currentPlan,
        String subscriptionStatus
){}
