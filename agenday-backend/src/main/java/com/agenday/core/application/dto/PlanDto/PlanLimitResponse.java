
package com.agenday.core.application.dto.PlanDto;
import java.util.UUID;
public record PlanLimitResponse (
    UUID id,
    String key,
    String value
) {}
