
package com.agenday.core.interfaces.controller;
import com.agenday.core.application.dto.Profissional.ProfessionalRequest;
import com.agenday.core.application.dto.ProfessionalResponse;
import com.agenday.core.application.service.ProfessionalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/professional")
public class ProfessionalController {
    private final ProfessionalService professionalService;
    public ProfessionalController(ProfessionalService professionalService){
        this.professionalService = professionalService;
    }

    @PostMapping("/promote")
    public ResponseEntity<ProfessionalResponse>
    promoteClientToProfessional (
            Authentication authentication, @RequestBody  @Valid  ProfessionalRequest request
    ) {
        String email = authentication.getName();
        return ResponseEntity.status(201)
            .body(professionalService.promoteClientToProfessional(email, request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ResponseEntity<ProfessionalResponse>
    getMyProfessionalProfile(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(professionalService.getMyProfessionalProfile(email));
    }

    @PatchMapping("/me")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ResponseEntity<ProfessionalResponse>
    updateMyProfessionalProfile (
        Authentication authentication, @RequestBody @Valid ProfessionalRequest request
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(professionalService.updateMyProfessionalProfile(email, request));
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ResponseEntity<Void> deleteMyProfessionalProfile(Authentication authentication){
        String email = authentication.getName();
        professionalService.deleteMyProfessionalProfile(email);
        return ResponseEntity.noContent().build();
    }
}