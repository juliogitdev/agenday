package com.agenday.core.application.dto.Professional;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record ProfessionalCatalogItemRequest(
        @NotNull(message = "O ID do vínculo do profissional com o estabelecimento é obrigatório")
        UUID professionalEstablishmentId,

        @NotNull(message = "O ID do serviço do catálogo é obrigatório")
        UUID catalogItemId,

        @Positive(message = "O preço customizado deve ser maior que zero")
        BigDecimal customPrice,

        @Positive(message = "A duração customizada deve ser maior que zero")
        Integer customDurationMinutes
) {
}