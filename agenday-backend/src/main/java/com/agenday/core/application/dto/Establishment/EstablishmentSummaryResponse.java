package com.agenday.core.application.dto.Establishment;

import com.agenday.core.application.dto.Address.AddressResponse;

import java.util.UUID;

public record EstablishmentSummaryResponse(
        UUID id,
        String name,
        String slogan,
        String slug,
        String imageUrl
) {}
