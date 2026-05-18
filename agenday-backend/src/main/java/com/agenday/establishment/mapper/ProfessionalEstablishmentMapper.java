package com.agenday.establishment.mapper;

import com.agenday.establishment.application.dto.ProfessionalEstablishmentResponse;
import com.agenday.establishment.domain.model.ProfessionalEstablishment;

public class ProfessionalEstablishmentMapper {


    public static ProfessionalEstablishmentResponse toDTO(ProfessionalEstablishment professionalEstablishment){

        return new ProfessionalEstablishmentResponse(
                professionalEstablishment.getId(),
                professionalEstablishment.getProfessional().getUser().getFullName(),
                professionalEstablishment.getEstablishment().getName(),
                professionalEstablishment.getStatus(),
                professionalEstablishment.getLinkedAt()

        );

    };

}
