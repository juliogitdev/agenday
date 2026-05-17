package com.agenday.iam.application.dto;

public record AuthResponse(
        String accessToken,
        // String refreshToken,  // não pode no corpo da resposta, precisa ser no cookie
        String type
) {}