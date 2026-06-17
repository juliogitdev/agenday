package com.agenday.core.mapper.Address;

import com.agenday.core.application.dto.Address.AddressRequest;
import com.agenday.core.application.dto.Address.AddressResponse;
import com.agenday.core.domain.model.Address.Address;

public class AddressMapper {

    public static AddressResponse toDTO(Address address){
        return new AddressResponse(
                address.getCep(),
                address.getState(),
                address.getCity(),
                address.getStreet(),
                address.getNumber(),
				address.getNeighborhood()
        );
    }

    public static Address toEntity(AddressRequest request){
        Address address = new Address();

        address.setCep(request.cep());
        address.setState(request.state());
        address.setCity(request.city());
        address.setStreet(request.street());
        address.setNumber(request.number());
		address.setNeighborhood(request.neighborhood());

        return address;
    }
}
