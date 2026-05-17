package com.agenday.establishment.interfaces.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agenday.establishment.application.dto.ProfessionalRequest;
import com.agenday.establishment.application.dto.ProfessionalResponse;
import com.agenday.establishment.application.service.ProfessionalService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/professional")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfessionalController {
    

    private final ProfessionalService professionalService;

    public ProfessionalController(ProfessionalService professionalService){
        this.professionalService = professionalService;
    }

    @PostMapping("/promote")
    public ResponseEntity<ProfessionalResponse> promoteClientToProfessional(Authentication authentication, @RequestBody @Valid ProfessionalRequest request){

        String email = authentication.getName();

        return ResponseEntity.status(201).body(professionalService.promoteClientToProfessional(email, request));
    }

    @GetMapping("/me")
    public ResponseEntity<ProfessionalResponse> getMyProfessionalProfile(Authentication authentication){
        String email = authentication.getName();

        return ResponseEntity.ok().body(professionalService.getMyProfessionalProfile(email));
    }
    

}
