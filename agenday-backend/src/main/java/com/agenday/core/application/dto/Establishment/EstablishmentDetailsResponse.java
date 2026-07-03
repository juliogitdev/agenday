package com.agenday.core.application.dto.Establishment;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record EstablishmentDetailsResponse(
        UUID establishmentId,
        String name,
        String imageUrl,
        List<CatalogItemSummary> catalogs
) {
    public record CatalogItemSummary(
            UUID catalogItemId,
            String name,
            BigDecimal price,
            Integer duration,
            List<ProfessionalSummary> professionals
    ) {}

    public record ProfessionalSummary(
            UUID professionalEstablishmentId,
            String name
    ) {}
}