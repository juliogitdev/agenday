package com.agenday.core.application.dto.Appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentRequest(
        @NotNull(message = "O vínculo do profissional com o estabelecimento é obrigatório.")
        UUID professionalEstablishmentId,

        @NotNull(message = "O item do catálogo (serviço) é obrigatório.")
        UUID catalogItemId,

        @NotNull(message = "A data e hora de início são obrigatórias.")
        @Future(message = "O agendamento deve ser para uma data e hora futuras.")
        LocalDateTime startTime,

        String notes
) {
}