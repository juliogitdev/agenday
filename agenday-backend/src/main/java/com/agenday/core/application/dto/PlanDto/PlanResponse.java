
package com.agenday.core.application.dto.PlanDto;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record PlanResponse(
    UUID id,
    String name,
    String description,
    BigDecimal price,
    Integer durationDays,
    Boolean isActive,
    List<PlanLimitResponse> limits
) {}