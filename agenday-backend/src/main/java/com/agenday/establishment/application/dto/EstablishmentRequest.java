package com.agenday.establishment.application.dto;

import jakarta.validation.constraints.NotBlank;

public record EstablishmentRequest(
        @NotBlank
        String name,

        String slogan,

        @NotBlank
        String ownerId,

        String numberPhone,

        String imageUrl,

        AddressRequest addressRequest
) {
}
