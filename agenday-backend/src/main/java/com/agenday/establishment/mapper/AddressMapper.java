package com.agenday.establishment.mapper;

import com.agenday.establishment.application.dto.AddressRequest;
import com.agenday.establishment.application.dto.AddressResponse;
import com.agenday.establishment.domain.model.Address;

public class AddressMapper {

    public static AddressResponse toDTO(Address address){
        return new AddressResponse(
                address.getCep(),
                address.getState(),
                address.getCity(),
                address.getStreet(),
                address.getNumber()
        );
    }

    public static Address toEntity(AddressRequest request){
        Address address = new Address();

        address.setCep(request.cep());
        address.setState(request.state());
        address.setCity(request.city());
        address.setStreet(request.street());
        address.setNumber(request.number());

        return address;
    }
}
