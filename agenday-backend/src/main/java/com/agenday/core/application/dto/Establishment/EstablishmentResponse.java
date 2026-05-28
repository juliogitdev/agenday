package com.agenday.core.application.dto.Establishment;

import com.agenday.core.application.dto.Address.AddressResponse;

import java.util.UUID;

public record EstablishmentResponse(
        UUID id,
        String name,
        String imageUrl,
        String slogan,
        String nameOwner,
        Short template,
        String palette,
        AddressResponse address
) {
}
