package com.agenday.core.interfaces.controller.Establishment;

import com.agenday.core.application.dto.Establishment.EstablishmentDetailsResponse;
import com.agenday.core.application.service.Establishment.EstablishmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/establishment/public")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PublicEstablishmentController {

    private final EstablishmentService establishmentService;

    @GetMapping("/slug/{slug}")
    public ResponseEntity<EstablishmentDetailsResponse> getDetailsBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(establishmentService.getDetailsBySlug(slug));
    }
}