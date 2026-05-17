package com.agenday.establishment.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProfessionalEstablishmentRequest(
        @NotNull
        UUID establishmentId,

        @NotBlank
        @Email
        String emailProfessional
) {
}
