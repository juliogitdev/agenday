package com.agenday.core.application.dto.CatalogItem;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record CatalogItemRequest(

        @NotNull UUID id_establishment,
        @NotBlank String name,
        String description,
        @NotNull BigDecimal defaultPrice,
        @NotNull Integer defaultDurationMinutes


) {
}
