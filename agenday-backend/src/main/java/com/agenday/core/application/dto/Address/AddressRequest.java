package com.agenday.core.application.dto.Address;

public record AddressRequest(
        String cep,
        String state,
        String city,
        String street,
        String number,
		String neighborhood
) {
}
