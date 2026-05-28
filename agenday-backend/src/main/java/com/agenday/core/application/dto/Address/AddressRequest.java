package com.agenday.core.application.dto;

public record AddressRequest(
        String cep,
        String state,
        String city,
        String street,
        String number,
		String neighborhood
) {
}
