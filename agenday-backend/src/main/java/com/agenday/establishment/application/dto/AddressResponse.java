package com.agenday.establishment.application.dto;

import jakarta.validation.constraints.NotBlank;

public record AddressResponse(
        String cep,

        @NotBlank
        String state,

        @NotBlank
        String city,

        String street,

        String number
) {
}
