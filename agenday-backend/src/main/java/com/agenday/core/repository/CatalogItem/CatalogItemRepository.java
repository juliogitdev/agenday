package com.agenday.core.repository.CatalogItem;

import com.agenday.core.domain.model.catalogItem.CatalogItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CatalogItemRepository extends JpaRepository<CatalogItem, UUID> {
}
