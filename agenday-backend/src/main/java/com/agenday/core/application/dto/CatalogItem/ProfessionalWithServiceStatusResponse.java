package com.agenday.core.application.dto.CatalogItem;

import java.util.UUID;

public record ProfessionalWithServiceStatusResponse(
        UUID professionalId,
        String professionalName,
        String professionalAvatarUrl,
        UUID professionalEstablishmentId,
        boolean isLinkedToService
) {
}