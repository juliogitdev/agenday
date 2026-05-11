package com.agenday.iam.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank
        String fullName,

        @NotBlank
        @Email
        String email,

        @NotBlank
        String password,

        @NotBlank
        String numberPhone,

        @NotBlank
        String state,

        @NotBlank
        String city

)
{ }
