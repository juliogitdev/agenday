package com.agenday.core.application.dto.Professional;

import java.math.BigDecimal;
import java.util.UUID;

public record ProfessionalCatalogItemResponse(
        UUID id,
        UUID professionalEstablishmentId,
        String professionalName,
        UUID catalogItemId,
        String catalogItemName,
        BigDecimal customPrice,
        Integer customDurationMinutes,
        Boolean isActive
) {
}
