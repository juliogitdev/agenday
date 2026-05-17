package com.agenday.establishment.mapper;

import com.agenday.establishment.application.dto.EstablishmentRequest;
import com.agenday.establishment.application.dto.EstablishmentResponse;
import com.agenday.establishment.domain.model.Establishment;
import com.agenday.iam.domain.model.User;

public class EstablishmentMapper {

    private final AddressMapper addressMapper;

    public EstablishmentMapper() {
        this.addressMapper = new AddressMapper();
    }

    public static EstablishmentResponse toDTO(Establishment establishment){

        User userOwner = establishment.getOwner();

        return new EstablishmentResponse(
                establishment.getId(),
                establishment.getName(),
                establishment.getSlogan(),
                userOwner.getFullName()
        );

    }

    public static Establishment toEntity(EstablishmentRequest establishmentRequest){

        Establishment newEstablishment = new Establishment();

        newEstablishment.setName(establishmentRequest.name());
        newEstablishment.setSlogan(establishmentRequest.slogan());
        newEstablishment.setAddress(AddressMapper.toEntity(establishmentRequest.addressRequest()));
        newEstablishment.setImageUrl(establishmentRequest.imageUrl());
        newEstablishment.setNumberPhone(establishmentRequest.numberPhone());

        return newEstablishment;
    }

    public static void updateEntity(Establishment establishment, EstablishmentRequest request) {
        establishment.setName(request.name());
        establishment.setSlogan(request.slogan());
        establishment.setNumberPhone(request.numberPhone());
        establishment.setImageUrl(request.imageUrl());

        if (request.addressRequest() != null) {
            establishment.getAddress().setCep(request.addressRequest().cep());
            establishment.getAddress().setState(request.addressRequest().state());
            establishment.getAddress().setCity(request.addressRequest().city());
            establishment.getAddress().setStreet(request.addressRequest().street());
            establishment.getAddress().setNumber(request.addressRequest().number());
        }
    }
}
