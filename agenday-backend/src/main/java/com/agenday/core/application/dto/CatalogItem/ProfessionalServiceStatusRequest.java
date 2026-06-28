package com.agenday.core.application.dto.CatalogItem;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProfessionalServiceStatusRequest(

        @NotNull(message = "establishmentId é obrigatório")
        UUID establishmentId,

        @NotNull(message = "catalogItemId é obrigatório")
        UUID catalogItemId

) {
}
