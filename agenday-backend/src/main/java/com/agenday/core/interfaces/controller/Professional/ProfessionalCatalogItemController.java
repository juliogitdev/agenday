package com.agenday.core.interfaces.controller.Professional;
import com.agenday.core.application.dto.Professional.ProfessionalCatalogItemRequest;
import com.agenday.core.application.dto.Professional.ProfessionalCatalogItemResponse;
import com.agenday.core.application.service.Professional.ProfessionalCatalogItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/professional-catalog-items")
@RequiredArgsConstructor
public class ProfessionalCatalogItemController {

    private final ProfessionalCatalogItemService service;

    @PostMapping
    public ResponseEntity<ProfessionalCatalogItemResponse> createAssociation(Authentication authentication,
            @RequestBody @Valid ProfessionalCatalogItemRequest request
    ) {
        String emailUserLogado = authentication.getName();

        ProfessionalCatalogItemResponse response = service.createAssociation(emailUserLogado, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
