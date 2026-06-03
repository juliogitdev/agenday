package com.agenday.core.interfaces.controller.CatalogItem;

import com.agenday.core.application.dto.CatalogItem.CatalogItemRequest;
import com.agenday.core.application.dto.CatalogItem.CatalogItemResponse;
import com.agenday.core.application.service.CatalogItem.CatalogItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/catalogItem")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ROLE_PROFESSIONAL')")

public class CatalogItemController {

    private final CatalogItemService catalogItemService;

    public CatalogItemController(CatalogItemService catalogItemService){
        this.catalogItemService = catalogItemService;
    }

    @PostMapping("/register")
    public ResponseEntity<CatalogItemResponse> register(
            Authentication authentication,
            @RequestBody @Valid CatalogItemRequest request
            )
    {
        String email = authentication.getName();
        return ResponseEntity.status(201).body(catalogItemService.createCatalogItem(email, request));

    }
}
