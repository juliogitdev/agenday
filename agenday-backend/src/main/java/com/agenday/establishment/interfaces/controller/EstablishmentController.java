package com.agenday.establishment.interfaces.controller;

import com.agenday.establishment.application.dto.EstablishmentRequest;
import com.agenday.establishment.application.dto.EstablishmentResponse;
import com.agenday.establishment.application.dto.ProfessionalEstablishmentRequest;
import com.agenday.establishment.application.dto.ProfessionalEstablishmentResponse;
import com.agenday.establishment.application.service.EstablishmentService;
import com.agenday.establishment.application.service.ProfessionalEstablishmentService;
import com.agenday.iam.application.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/establishment")
@CrossOrigin(origins = "http://localhost:3000")
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


}
