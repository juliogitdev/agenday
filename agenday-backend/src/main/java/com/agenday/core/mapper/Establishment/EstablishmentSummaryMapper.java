package com.agenday.core.mapper.Establishment;

import com.agenday.core.application.dto.Address.AddressResponse;
import com.agenday.core.application.dto.Establishment.EstablishmentRequest;
import com.agenday.core.application.dto.Establishment.EstablishmentResponse;
import com.agenday.core.application.dto.Establishment.EstablishmentSummaryResponse;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.mapper.Address.AddressMapper;
import com.agenday.iam.domain.model.User;

public class EstablishmentSummaryMapper {
    public static EstablishmentSummaryResponse toDTO(Establishment establishment){
        return new EstablishmentSummaryResponse(
                establishment.getId(),
                establishment.getName(),
                establishment.getSlogan(),
                establishment.getSlug(),
                establishment.getImageUrl()

        );
    }
}