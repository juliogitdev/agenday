package com.agenday.core.interfaces.controller.Establishment;

import com.agenday.core.application.dto.Establishment.*;
import com.agenday.core.application.service.Establishment.EstablishmentService;
import com.agenday.core.application.service.Professional.ProfessionalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/establishment")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ROLE_PROFESSIONAL')")
public class EstablishmentController {
    private final EstablishmentService establishmentService;
    private final ProfessionalService professionalService;

    public EstablishmentController(
            EstablishmentService establishmentService,
            ProfessionalService professionalService) {
        this.establishmentService = establishmentService;
        this.professionalService = professionalService;
    }

    @PostMapping("/register")
    public ResponseEntity<EstablishmentResponse> register(
            Authentication authentication,
            @RequestBody @Valid EstablishmentRequest request) {
        String email = authentication.getName();
        return ResponseEntity.status(201).body(establishmentService.createEstablishment(email, request));
    }

    @GetMapping("/my-units")
    public ResponseEntity<List<EstablishmentResponse>> getMyEstablishments(Authentication authentication) {
        String email = authentication.getName();
        List<EstablishmentResponse> response = establishmentService.getEstablishmentsByProfessional(email);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/my-units/summary")
    public ResponseEntity<List<EstablishmentSummaryResponse>> getMyEstablishmentsSummary(Authentication authentication) {
        String email = authentication.getName();
        List<EstablishmentSummaryResponse> response = establishmentService.getEstablishmentsByProfessionalSummary(email);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EstablishmentResponse> updateEstablishment(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody EstablishmentRequest request) {
        String email = authentication.getName();
        return ResponseEntity.status(200).body(establishmentService.updateEstablishment(id, email, request));
    }

    @PostMapping("/{id}/logoUpdate")
    public ResponseEntity<GetPresignedUploadUrlResponse> getPresignedUrl(
            @PathVariable UUID id,
            @RequestParam("filename") String originalFilename,
            Authentication authentication) {

        String emailUser = authentication.getName();
        GetPresignedUploadUrlResponse responseData = establishmentService.getPresignedUploadUrl(id, emailUser, originalFilename);
        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstablishment(@PathVariable UUID id, Authentication authentication) {
        String email = authentication.getName();
        establishmentService.softDelete(id, email);
        return ResponseEntity.noContent().build();
    }
}