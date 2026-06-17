
package com.agenday.core.application.dto.PlanDto;
import jakarta.validation.constraints.NotBlank;

public record PlanLimitCreateRequest(
    @NotBlank(message = "Key is required")   String key,
    @NotBlank(message = "Value is required") String value
) {}