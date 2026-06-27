package com.agenday.core.application.dto.Appointment;

import com.agenday.core.domain.enums.AppointmentStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        UUID customerId,
        String customerName,
        UUID professionalEstablishmentId,
        String professionalName,
        String catalogItemName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        AppointmentStatus status,
        String notes
) {
}