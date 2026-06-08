package com.agenday.core.application.dto.Professional;

import java.math.BigDecimal;
import java.util.UUID;

public record AvailableProfessionalResponse(
        UUID professionalEstablishmentId,
        String professionalName,
        String profileImageUrl,
        BigDecimal finalPrice,
        Integer finalDurationMinutes
) {
}
