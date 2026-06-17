package com.agenday.iam.application.dto;

import java.util.UUID;

public record UserResponse(
        UUID uuid,
        String email,
        String fullName
) {}