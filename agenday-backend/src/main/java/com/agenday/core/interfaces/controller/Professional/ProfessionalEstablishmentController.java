package com.agenday.core.interfaces.controller.Professional;

import com.agenday.core.application.dto.Professional.InvitationActionRequest;
import com.agenday.core.application.dto.Professional.ProfessionalEstablishmentRequest;
import com.agenday.core.application.dto.Professional.ProfessionalEstablishmentResponse;
import com.agenday.core.application.dto.Professional.ProfessionalInvitationResponse;
import com.agenday.core.application.service.Professional.ProfessionalEstablishmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/professional-establishments")
@RequiredArgsConstructor
public class ProfessionalEstablishmentController {

    private final ProfessionalEstablishmentService establishmentService;

    @PostMapping
    public ResponseEntity<ProfessionalEstablishmentResponse> linkProfessional(
            @RequestBody @Valid ProfessionalEstablishmentRequest request,
            Authentication authentication) {

        ProfessionalEstablishmentResponse response = establishmentService.linkProfessional(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/establishment/{establishmentId}")
    public ResponseEntity<List<ProfessionalEstablishmentResponse>> getProfessionalsFromEstablishment(
            @PathVariable UUID establishmentId,
            Authentication authentication) {

        List<ProfessionalEstablishmentResponse> response = establishmentService.getProfessionalsByEstablishment(establishmentId, authentication);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/v1/professional-establishments/invitations/action
     * Aceita ou rejeita um convite de estabelecimento
     */
    @PatchMapping("/invitations/action")
    public ResponseEntity<ProfessionalEstablishmentResponse> handleInvitation(
            @RequestBody @Valid InvitationActionRequest request,
            Authentication authentication) {

        ProfessionalEstablishmentResponse response = establishmentService.handleInvitation(request, authentication);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<ProfessionalInvitationResponse>> getPendingInvitations(
            Authentication authentication) {

        List<ProfessionalInvitationResponse> invitations = establishmentService.getPendingInvitations(authentication);
        return ResponseEntity.ok(invitations);
    }
}