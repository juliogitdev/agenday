package com.agenday.core.application.dto;

import java.util.UUID;

public record EstablishmentResponse(
        UUID id,
        String name,
        String slogan,
        String nameOwner,
        Short template,
        String palette
) {
}
