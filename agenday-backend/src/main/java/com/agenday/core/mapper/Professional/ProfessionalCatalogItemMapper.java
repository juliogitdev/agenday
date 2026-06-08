package com.agenday.core.mapper.Professional;

import com.agenday.core.application.dto.Professional.AvailableProfessionalResponse;
import com.agenday.core.application.dto.Professional.ProfessionalCatalogItemRequest;
import com.agenday.core.application.dto.Professional.ProfessionalCatalogItemResponse;
import com.agenday.core.domain.model.Professional.ProfessionalCatalogItem;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.domain.model.catalogItem.CatalogItem;

import java.math.BigDecimal;

public class ProfessionalCatalogItemMapper{
    public static ProfessionalCatalogItem toEntity(
            ProfessionalCatalogItemRequest request,
            ProfessionalEstablishment link,
            CatalogItem catalogItem
    ) {
        ProfessionalCatalogItem entity = new ProfessionalCatalogItem();
        entity.setProfessionalEstablishment(link);
        entity.setCatalogItem(catalogItem);
        entity.setCustomPrice(request.customPrice());
        entity.setCustomDurationMinutes(request.customDurationMinutes());
        entity.setIsActive(true);

        return entity;
    }


    public static ProfessionalCatalogItemResponse toResponseDTO(ProfessionalCatalogItem entity) {
        return new ProfessionalCatalogItemResponse(
                entity.getId(),
                entity.getProfessionalEstablishment().getId(),
                entity.getProfessionalEstablishment().getProfessional().getUser().getFullName(),
                entity.getCatalogItem().getId(),
                entity.getCatalogItem().getDescription(),
                entity.getCustomPrice(),
                entity.getCustomDurationMinutes(),
                entity.getIsActive()
        );
    }

    public static AvailableProfessionalResponse toAvailableProfessionalDTO(ProfessionalCatalogItem entity) {
        BigDecimal finalPrice = entity.getCustomPrice() != null
                ? entity.getCustomPrice()
                : entity.getCatalogItem().getDefaultPrice();

        Integer finalDuration = entity.getCustomDurationMinutes() != null
                ? entity.getCustomDurationMinutes()
                : entity.getCatalogItem().getDefaultDurationMinutes();

        return new AvailableProfessionalResponse(
                entity.getProfessionalEstablishment().getId(),
                entity.getProfessionalEstablishment().getProfessional().getUser().getFullName(),
                entity.getProfessionalEstablishment().getProfessional().getUser().getProfileImageUrl(),
                finalPrice,
                finalDuration
        );
    }
}
