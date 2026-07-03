package com.agenday.core.mapper.Establishment;

import com.agenday.core.application.dto.Establishment.EstablishmentDetailsResponse;
import com.agenday.core.application.dto.Establishment.EstablishmentDetailsResponse.CatalogItemSummary;
import com.agenday.core.application.dto.Establishment.EstablishmentDetailsResponse.ProfessionalSummary;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.domain.model.Professional.ProfessionalCatalogItem;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

public class EstablishmentDetailsMapper {

    private EstablishmentDetailsMapper() {}

    public static EstablishmentDetailsResponse toDTO(Establishment establishment,
                                                     List<ProfessionalCatalogItem> items) {

        Map<UUID, List<ProfessionalCatalogItem>> groupedByCatalogItem = items.stream()
                .collect(Collectors.groupingBy(pci -> pci.getCatalogItem().getId()));

        List<CatalogItemSummary> catalogs = groupedByCatalogItem.values().stream()
                .map(group -> {
                    var catalogItem = group.get(0).getCatalogItem();
                    List<ProfessionalSummary> professionals = group.stream()
                            .map(pci -> new ProfessionalSummary(
                                    pci.getProfessionalEstablishment().getId(),
                                    pci.getProfessionalEstablishment().getProfessional().getUser().getFullName()
                            ))
                            .toList();

                    return new CatalogItemSummary(
                            catalogItem.getId(),
                            catalogItem.getName(),
                            catalogItem.getDefaultPrice(),
                            catalogItem.getDefaultDurationMinutes(),
                            professionals
                    );
                })
                .toList();

        return new EstablishmentDetailsResponse(
                establishment.getId(),
                establishment.getName(),
                establishment.getImageUrl(),
                catalogs
        );
    }
}