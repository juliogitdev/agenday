package com.agenday.core.interfaces.controller.Appointment;

import com.agenday.core.application.dto.Appointment.AppointmentRequest;
import com.agenday.core.application.dto.Appointment.AppointmentResponse;
import com.agenday.core.application.dto.Appointment.AvailableSlotsRequest;
import com.agenday.core.application.dto.Appointment.AvailableSlotsResponse;
import com.agenday.core.application.service.Appointment.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    /**
     * POST /api/v1/appointments
     */
    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @RequestBody @Valid AppointmentRequest request,
            Authentication authentication) {

        AppointmentResponse response = appointmentService.createAppointment(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * DELETE /api/v1/appointments/{appointmentId}
     */
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> cancelAppointment(
            @PathVariable UUID appointmentId,
            Authentication authentication) {

        appointmentService.cancelAppointment(appointmentId, authentication);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/appointments/my-appointments
     */
    @GetMapping("/my-appointments")
    public ResponseEntity<List<AppointmentResponse>> getCustomerAppointments(
            Authentication authentication) {

        List<AppointmentResponse> responses = appointmentService.getCustomerAppointments(authentication);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /api/v1/appointments/professional/{professionalEstabId}
     * Retorna os agendamentos de um profissional filtrados por um período de tempo.
     */
    @GetMapping("/professional/{professionalEstabId}")
    public ResponseEntity<List<AppointmentResponse>> getProfessionalAgenda(
            @PathVariable UUID professionalEstabId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            Authentication authentication) {

        List<AppointmentResponse> responses = appointmentService.getProfessionalAgenda(
                authentication, professionalEstabId, start, end
        );
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<AvailableSlotsResponse>> getAvailableSlots(
            @ModelAttribute @Valid AvailableSlotsRequest request) {

        List<AvailableSlotsResponse> slots = appointmentService.getAvailableSlots(request);
        return ResponseEntity.ok(slots);
    }
}
