
package com.agenday.core.application.dto.PlanDto;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

public record PlanUpdateRequest(
    String name,
    String description,
    BigDecimal price,
    Integer durationDays,
    Boolean isActive,

    @Valid
    List<PlanLimitCreateRequest> limits
){}
