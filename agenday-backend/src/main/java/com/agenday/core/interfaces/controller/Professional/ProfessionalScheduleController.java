package com.agenday.core.interfaces.controller.Professional;

import com.agenday.core.application.dto.Professional.ProfessionalScheduleRequest;
import com.agenday.core.application.dto.Professional.ProfessionalScheduleResponse;
import com.agenday.core.application.service.Professional.ProfessionalScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/professional-schedules")
@RequiredArgsConstructor
public class ProfessionalScheduleController {

    private final ProfessionalScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<ProfessionalScheduleResponse> createSchedule(
            @RequestBody @Valid ProfessionalScheduleRequest request,
            Authentication authentication) {

        ProfessionalScheduleResponse response = scheduleService.createSchedule(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/establishment/{professionalEstabId}")
    public ResponseEntity<List<ProfessionalScheduleResponse>> getSchedules(
            @PathVariable UUID professionalEstabId) {

        List<ProfessionalScheduleResponse> responses =
                scheduleService.getSchedulesByEstablishment(professionalEstabId);
        return ResponseEntity.ok(responses);
    }
}