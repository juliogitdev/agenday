package com.agenday.core.application.dto.Appointment;

import java.time.LocalDateTime;

public record AvailableSlotsResponse(
        LocalDateTime startTime
) {}
