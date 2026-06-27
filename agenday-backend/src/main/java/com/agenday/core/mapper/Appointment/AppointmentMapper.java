package com.agenday.core.mapper.Appointment;

import com.agenday.core.application.dto.Appointment.AppointmentResponse;
import com.agenday.core.domain.model.Appointment.Appointment;

public class AppointmentMapper {

    public static AppointmentResponse toDTO(Appointment entity) {
        if (entity == null) return null;

        return new AppointmentResponse(
                entity.getId(),
                entity.getCustomer().getId(),
                entity.getCustomer().getFullName(),
                entity.getProfessionalEstablishment().getId(),
                entity.getProfessionalEstablishment().getProfessional().getUser().getFullName(),
                entity.getCatalogItem().getName(),
                entity.getStartTime(),
                entity.getEndTime(),
                entity.getStatus(),
                entity.getNotes()
        );
    }
}
