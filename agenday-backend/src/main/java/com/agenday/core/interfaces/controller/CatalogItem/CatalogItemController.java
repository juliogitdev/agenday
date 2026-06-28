package com.agenday.core.interfaces.controller.CatalogItem;

import com.agenday.core.application.dto.CatalogItem.*;
import com.agenday.core.application.service.CatalogItem.CatalogItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @DeleteMapping("/delete/{catalogItemId}")
    public ResponseEntity<Void> deleteCatalog(Authentication authentication, @PathVariable UUID catalogItemId) {
        String email = authentication.getName();
        catalogItemService.deleteCatalogItem(email, catalogItemId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/update/{catalogItemId}")
    public ResponseEntity<CatalogItemResponse> updateCatalogItem(
            @PathVariable UUID catalogItemId,
            @RequestBody @Valid CatalogItemUpdateRequest request,
            Authentication authentication
    )
    {

        String email = authentication.getName();

        return ResponseEntity.status(200).body(catalogItemService.updateCatalogItem(
                email,
                request,
                catalogItemId
        ));

    }

    @GetMapping("/establishment/{establishmentId}")
    public ResponseEntity<List<CatalogItemResponse>> listCatalogItem(
            @PathVariable UUID establishmentId,
            Authentication authentication
    ){
        String email = authentication.getName();

        return ResponseEntity.status(200).body(
                catalogItemService.listByEstablishment(email, establishmentId));
    }

    @PostMapping("/professionals-with-service-status")
    public ResponseEntity<List<ProfessionalWithServiceStatusResponse>> getProfessionalsWithServiceStatus(
            Authentication authentication,
            @RequestBody @Valid ProfessionalServiceStatusRequest request) {

        String email = authentication.getName();
        List<ProfessionalWithServiceStatusResponse> professionals = catalogItemService.getProfessionalsWithServiceStatus(
                email,
                request
        );

        return ResponseEntity.ok(professionals);
    }
}
