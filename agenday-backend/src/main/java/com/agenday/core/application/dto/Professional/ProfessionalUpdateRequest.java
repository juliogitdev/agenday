package com.agenday.core.application.dto.Professional;

import java.time.LocalDate;

public record ProfessionalUpdateRequest(
    String bio,
    LocalDate workingSince,
    String instagramUrl,
    String specializedIn
) {}
