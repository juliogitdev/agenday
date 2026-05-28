
package com.agenday.core.application.dto.PlanDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public record PlanCreateRequest(
    @NotBlank(message = "Name is required")  String name,
    String description,

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be positive")
    BigDecimal price,

    @NotNull(message = "Duration days is required")
    @Positive(message = "Duration must be greater than zero")
    Integer durationDays,

    Boolean isActive,
    @Valid
    List<PlanLimitCreateRequest> limits
) {}
