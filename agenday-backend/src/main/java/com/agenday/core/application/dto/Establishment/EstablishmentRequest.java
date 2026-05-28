package com.agenday.core.application.dto.Establishment;

import com.agenday.core.application.dto.Address.AddressRequest;
import jakarta.validation.constraints.NotBlank;

public record EstablishmentRequest(
        @NotBlank
        String name,

        String slogan,

        String numberPhone,

        String imageUrl,

        Short template,

        String palette,

        AddressRequest addressRequest
) {
}
