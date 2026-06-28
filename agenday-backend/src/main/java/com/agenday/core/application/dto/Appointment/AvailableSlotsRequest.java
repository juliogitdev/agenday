package com.agenday.core.application.dto.Appointment;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record AvailableSlotsRequest(
        @NotNull(message = "professionalEstabId é obrigatório")
        UUID professionalEstabId,

        @NotNull(message = "date é obrigatório")
        LocalDate date,

        @NotNull(message = "catalogItemId é obrigatório")
        UUID catalogItemId
) {
}