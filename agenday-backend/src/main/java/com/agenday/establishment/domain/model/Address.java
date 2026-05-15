package com.agenday.establishment.domain.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {

    private String cep;
    private String state;
    private String city;
    private String street;
    private String number;

}
