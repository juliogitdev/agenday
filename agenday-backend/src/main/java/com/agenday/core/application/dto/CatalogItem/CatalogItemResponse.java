package com.agenday.core.application.dto.CatalogItem;

import java.math.BigDecimal;
import java.util.UUID;

public record CatalogItemResponse (
        UUID id,
        String name,
        String description,
        String establishment,
        BigDecimal defaultPrice,
        Integer defaultDurationMinutes
){
}
