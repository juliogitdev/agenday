package com.agenday.establishment.application.dto;

public record AddressRequest(
        String cep,

        String state,

        String city,

        String street,

        String number
) {
}
