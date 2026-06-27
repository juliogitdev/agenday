package com.agenday.core.application.dto.Professional;

import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

public record ProfessionalScheduleRequest(
        @NotNull(message = "O ID do vínculo profissional-estabelecimento é obrigatório.")
        UUID professionalEstablishmentId,

        @NotNull(message = "O dia da semana é obrigatório.")
        DayOfWeek dayOfWeek,

        @NotNull(message = "O horário de início do turno é obrigatório.")
        LocalTime startTime,

        @NotNull(message = "O horário de término do turno é obrigatório.")
        LocalTime endTime
) {}