package com.agenday.core.application.dto.Establishment;

import com.agenday.core.domain.enums.LinkStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProfessionalEstablishmentResponse(
        UUID id,
        String professionalName,
        String establishmentName,
        LinkStatus status,
        LocalDateTime linkedAt
) {
}
