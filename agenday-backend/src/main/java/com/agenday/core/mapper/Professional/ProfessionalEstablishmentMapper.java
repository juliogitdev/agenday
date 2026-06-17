package com.agenday.core.mapper.Professional;

import com.agenday.core.application.dto.Professional.ProfessionalEstablishmentResponse;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;

public class ProfessionalEstablishmentMapper {
    public static ProfessionalEstablishmentResponse toDTO(ProfessionalEstablishment entity) {
        if (entity == null) return null;

        return new ProfessionalEstablishmentResponse(
                entity.getId(),
                entity.getProfessional().getUser().getFullName(),
                entity.getEstablishment().getName(),
                entity.getStatus(),
                entity.getLinkedAt()
        );
    }
}
