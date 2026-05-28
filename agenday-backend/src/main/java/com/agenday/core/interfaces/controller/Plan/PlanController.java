package com.agenday.core.interfaces.controller.Plan;

import com.agenday.core.application.dto.PlanDto.PlanCreateRequest;
import com.agenday.core.application.dto.PlanDto.PlanResponse;
import com.agenday.core.application.dto.PlanDto.PlanUpdateRequest;
import com.agenday.core.application.service.Plan.PlanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/plans")
public class PlanController {
    private final PlanService planService;
    public PlanController(PlanService planService) {this.planService = planService;}

    @GetMapping("/{id}")
    public ResponseEntity<PlanResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(planService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<PlanResponse>> getAll() {
        return ResponseEntity.ok(planService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanResponse> create(@Valid @RequestBody PlanCreateRequest request) {
        return ResponseEntity.status(201).body(planService.create(request));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanResponse> update(
            @PathVariable UUID id, @Valid @RequestBody PlanUpdateRequest request) {
        return ResponseEntity.ok(planService.update(id, request));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        planService.delete(id);
        return ResponseEntity.noContent().build();
    }
}