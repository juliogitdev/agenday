package com.agenday.core.application.dto.CatalogItem;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record CatalogItemRequest(

        @NotNull UUID id_establishment,
        @NotBlank String name,
        String description,
        @NotNull @DecimalMin(value = "0.0", message = "O preço do serviço precisa ser positivo") BigDecimal defaultPrice,
        @NotNull @Min(value = 0, message = "O valor da duração precisa ser positivo") Integer defaultDurationMinutes
) {
}
