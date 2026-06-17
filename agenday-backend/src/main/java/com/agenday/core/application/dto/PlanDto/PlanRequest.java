
package com.agenday.core.application.dto.PlanDto;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record PlanRequest (
    @NotNull(message = "Plan id is required")  UUID planId
) {}