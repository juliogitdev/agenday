package com.agenday.core.application.dto.Professional;
import com.agenday.core.domain.enums.LinkStatus;
import com.agenday.core.domain.model.Address.Address;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

public record ProfessionalInvitationResponse(
        UUID linkId,
        UUID establishmentId,
        String establishmentName,
        Address establishmentAddress,
        LinkStatus status,
        Instant invitedAt
) {
}
