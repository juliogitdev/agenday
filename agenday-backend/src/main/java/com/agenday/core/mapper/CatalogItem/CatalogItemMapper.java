package com.agenday.core.mapper.CatalogItem;

import com.agenday.core.application.dto.CatalogItem.CatalogItemRequest;
import com.agenday.core.application.dto.CatalogItem.CatalogItemResponse;
import com.agenday.core.application.dto.CatalogItem.CatalogItemUpdateRequest;
import com.agenday.core.domain.model.catalogItem.CatalogItem;

public class CatalogItemMapper {

    public static CatalogItemResponse toDTO(CatalogItem c){
        return new CatalogItemResponse(
                c.getId(),
                c.getName(),
                c.getDescription(),
                c.getEstablishment().getName(),
                c.getDefaultPrice(),
                c.getDefaultDurationMinutes()
        );
    }

    public static CatalogItem toEntity(CatalogItemRequest request){
        CatalogItem entity = new CatalogItem();

        entity.setName(request.name());
        entity.setDescription(request.description());
        entity.setDefaultPrice(request.defaultPrice());
        entity.setDefaultDurationMinutes(request.defaultDurationMinutes());

        return entity;
    }

    public static CatalogItem updateEntity(CatalogItem catalogItem, CatalogItemUpdateRequest request){
        catalogItem.setDescription(request.description());
        catalogItem.setDefaultPrice(request.defaultPrice());
        catalogItem.setDefaultDurationMinutes(request.defaultDurationMinutes());
        return catalogItem;
    }

}
