package com.agenday.iam.application.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String type
) {}