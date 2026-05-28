package com.agenday.core.interfaces.controller;

import com.agenday.core.application.dto.EstablishmentRequest;
import com.agenday.core.application.dto.EstablishmentResponse;
import com.agenday.core.application.dto.Image.ImageUpdateRequest;
import com.agenday.core.application.dto.ProfessionalEstablishmentRequest;
import com.agenday.core.application.dto.ProfessionalEstablishmentResponse;
import com.agenday.core.application.service.EstablishmentService;
import com.agenday.core.application.service.ProfessionalEstablishmentService;
import com.agenday.iam.application.service.UserService;
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
public class EstablishmentController {

    private final UserService userService;
    private final EstablishmentService establishmentService;
    private final ProfessionalEstablishmentService professionalEstablishmentService;

    public EstablishmentController(
            UserService userService,
            EstablishmentService establishmentService,
            ProfessionalEstablishmentService professionalEstablishmentService){
        this.userService = userService;
        this.establishmentService = establishmentService;
        this.professionalEstablishmentService = professionalEstablishmentService;
    }

    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSIONAL')")
    public ResponseEntity<EstablishmentResponse> register(Authentication authentication, @RequestBody @Valid EstablishmentRequest request){

        String email = authentication.getName();

        return ResponseEntity.status(201).body(establishmentService.createEstablishment(email, request));
    }


    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EstablishmentResponse>> getAll(){
        return ResponseEntity.ok().body(establishmentService.getAll());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ResponseEntity<EstablishmentResponse> updateEstablishment(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody EstablishmentRequest request
    ){

        String email = authentication.getName();

        return ResponseEntity.status(200).
                body(establishmentService.updateEstablishment(id, email, request));

    }

    @PostMapping("/invite")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ResponseEntity<ProfessionalEstablishmentResponse> invite(
            Authentication authentication,
            @Valid @RequestBody ProfessionalEstablishmentRequest request) {

        String email = authentication.getName();
        return ResponseEntity.status(201)
                .body(professionalEstablishmentService.inviteProfessional(email, request));
    }

	@DeleteMapping("/{id}/image/delete")
	@PreAuthorize("hasRole('PROFESSIONAL')")
	public ResponseEntity<Void> deleteImage( Authentication authentication, @PathVariable UUID id) throws Exception {
		establishmentService.deleteImage(id,authentication.getName());
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}/image/update")
	@PreAuthorize("hasRole('PROFESSIONAL')")
	public ResponseEntity<Void> updateImage(
		Authentication authentication, 
		@PathVariable UUID id, 
		@RequestBody ImageUpdateRequest request) throws Exception {
    	establishmentService.updateImage(id,authentication.getName(),request.imgUrl());
    	return ResponseEntity.noContent().build();
	}
}
