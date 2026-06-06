package com.agenday.core.application.dto.CatalogItem;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CatalogItemUpdateRequest(
        String description,

        @NotNull
        @DecimalMin(value = "0.0", message = "O preço do serviço precisa ser positivo")
        BigDecimal defaultPrice,

        @NotNull
        @Min(value = 0, message = "O valor da duração precisa ser positivo")
        Integer defaultDurationMinutes

) {
}
