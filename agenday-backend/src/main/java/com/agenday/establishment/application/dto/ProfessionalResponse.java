package com.agenday.establishment.application.dto;

import java.util.UUID;

public record ProfessionalResponse (
        UUID id,
        String userName,
        String bio,
        String profileImageUrl
){}
