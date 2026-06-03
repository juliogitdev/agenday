package com.agenday.core.mapper.Establishment;

import com.agenday.core.application.dto.Address.AddressResponse;
import com.agenday.core.application.dto.Establishment.EstablishmentRequest;
import com.agenday.core.application.dto.Establishment.EstablishmentResponse;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.mapper.Address.AddressMapper;
import com.agenday.iam.domain.model.User;

public class EstablishmentMapper {

    public static EstablishmentResponse toDTO(Establishment establishment) {
        User owner = establishment.getOwner();
        AddressResponse addressResponse = null;

        if (establishment.getAddress() != null)
            addressResponse = AddressMapper.toDTO(establishment.getAddress());

        return new EstablishmentResponse(
            establishment.getId(),
            establishment.getName(),
            establishment.getImageUrl(),
            establishment.getSlogan(),
            owner != null ? owner.getFullName() : null,
            establishment.getTemplate(),
            establishment.getPalette(),
            establishment.getNumberPhone(),
            establishment.getCategory(),
            addressResponse
        );
    }

    public static Establishment toEntity(EstablishmentRequest request) {
        Establishment establishment = new Establishment();
        establishment.setName(request.name());
        establishment.setSlogan(request.slogan());
        establishment.setNumberPhone(request.numberPhone());
        establishment.setImageUrl(request.imageUrl());
        establishment.setTemplate(request.template());
        establishment.setPalette(request.palette());
        establishment.setCategory(request.category());

        if (request.addressRequest() != null)
            establishment.setAddress(AddressMapper.toEntity(request.addressRequest()));

        return establishment;
    }

    public static void updateEntity(Establishment establishment, EstablishmentRequest request) {
        establishment.setName(request.name());
        establishment.setSlogan(request.slogan());
        establishment.setNumberPhone(request.numberPhone());
        establishment.setImageUrl(request.imageUrl());
        establishment.setTemplate(request.template());
        establishment.setPalette(request.palette());
        establishment.setCategory(request.category());

        if (request.addressRequest() != null)
            establishment.setAddress(AddressMapper.toEntity(request.addressRequest()));
    }
}