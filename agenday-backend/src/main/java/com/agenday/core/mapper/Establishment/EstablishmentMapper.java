package com.agenday.core.mapper.Establishment;

import com.agenday.core.application.dto.Address.AddressResponse;
import com.agenday.core.application.dto.Establishment.EstablishmentRequest;
import com.agenday.core.application.dto.Establishment.EstablishmentResponse;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.mapper.Address.AddressMapper;
import com.agenday.iam.domain.model.User;

public class EstablishmentMapper {

    private final AddressMapper addressMapper;

    public EstablishmentMapper() {
        this.addressMapper = new AddressMapper();
    }

    public static EstablishmentResponse toDTO(Establishment establishment){

        User userOwner = establishment.getOwner();
        AddressResponse addressDTO = null;

        if (establishment.getAddress() != null) {
            addressDTO = new AddressResponse(
                establishment.getAddress().getCep(),
                establishment.getAddress().getState(),
                establishment.getAddress().getCity(),
                establishment.getAddress().getStreet(),
                establishment.getAddress().getNumber(),
                establishment.getAddress().getNeighborhood()
            );
        }
        return new EstablishmentResponse(
                establishment.getId(),
                establishment.getName(),
                establishment.getImageUrl(),
                establishment.getSlogan(),
                userOwner.getFullName(),
                establishment.getTemplate(),
                establishment.getPalette(),
                addressDTO
        );

    }

    public static Establishment toEntity(EstablishmentRequest establishmentRequest){
        Establishment newEstablishment = new Establishment();
        newEstablishment.setName(establishmentRequest.name());
        newEstablishment.setSlogan(establishmentRequest.slogan());
        newEstablishment.setAddress(AddressMapper.toEntity(establishmentRequest.addressRequest()));
        newEstablishment.setImageUrl(establishmentRequest.imageUrl());
        newEstablishment.setNumberPhone(establishmentRequest.numberPhone());
        newEstablishment.setTemplate(establishmentRequest.template());
        newEstablishment.setPalette(establishmentRequest.palette());
        return newEstablishment;
    }

    public static void updateEntity(Establishment establishment, EstablishmentRequest request) {
        establishment.setName(request.name());
        establishment.setSlogan(request.slogan());
        establishment.setNumberPhone(request.numberPhone());
        establishment.setImageUrl(request.imageUrl());
        establishment.setTemplate(request.template());
        establishment.setPalette(request.palette());

        if (request.addressRequest() != null) {
            establishment.getAddress().setCep(request.addressRequest().cep());
            establishment.getAddress().setState(request.addressRequest().state());
            establishment.getAddress().setCity(request.addressRequest().city());
            establishment.getAddress().setStreet(request.addressRequest().street());
            establishment.getAddress().setNumber(request.addressRequest().number());
        }
    }
}
