package com.agenday.core.application.dto.Professional;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record InvitationActionRequest(
        @NotNull(message = "linkId é obrigatório")
        UUID linkId,

        @NotNull(message = "action é obrigatório")
        Boolean accepted
) {
}
