package com.agenday.core.repository.CatalogItem;

import com.agenday.core.domain.model.catalogItem.CatalogItem;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.xml.catalog.Catalog;
import java.util.List;
import java.util.UUID;

public interface CatalogItemRepository extends JpaRepository<CatalogItem, UUID> {

    List<CatalogItem> findByEstablishmentIdAndIsActiveTrue(UUID establishmentId);

}
