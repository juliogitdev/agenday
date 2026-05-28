package com.agenday.core.application.dto.Address;

import jakarta.validation.constraints.NotBlank;

public record AddressResponse(
        String cep,
        String state,
        String city,
        String street,
        String number,
		String neighborhood
) {
}
