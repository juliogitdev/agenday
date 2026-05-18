package com.agenday.establishment.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Address {

    private String cep;
    @Column(nullable = false)
    private String state;
    @Column(nullable = false)
    private String city;
    private String street;
    private String number;

}
