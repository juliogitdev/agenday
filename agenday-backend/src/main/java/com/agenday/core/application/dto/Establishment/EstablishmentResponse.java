package com.agenday.core.application.dto.Establishment;

import com.agenday.core.application.dto.Address.AddressResponse;
import com.agenday.core.domain.enums.EstablishmentCategory;
import java.util.UUID;

public record EstablishmentResponse(
    UUID id,
    String name,
    String imageUrl,
    String slogan,
    String slug,
    String nameOwner,
    Short template,
    String palette,
    String numberPhone,
    EstablishmentCategory category,
    AddressResponse address
) {}
