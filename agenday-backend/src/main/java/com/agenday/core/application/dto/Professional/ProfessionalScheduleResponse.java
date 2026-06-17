package com.agenday.core.application.dto.Professional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

public record ProfessionalScheduleResponse(
        UUID id,
        UUID professionalEstablishmentId,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        Boolean isActive
) {}