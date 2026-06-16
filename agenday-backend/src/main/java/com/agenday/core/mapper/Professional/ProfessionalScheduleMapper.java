package com.agenday.core.mapper.Professional;

import com.agenday.core.application.dto.Professional.ProfessionalScheduleRequest;
import com.agenday.core.application.dto.Professional.ProfessionalScheduleResponse;
import com.agenday.core.domain.model.Professional.ProfessionalSchedule;

public class ProfessionalScheduleMapper {

    public static ProfessionalSchedule toEntity(ProfessionalScheduleRequest request){
        ProfessionalSchedule schedule = ProfessionalSchedule.builder()
                .dayOfWeek(request.dayOfWeek())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .build();

        return schedule;
    }

    public static ProfessionalScheduleResponse toDTO(ProfessionalSchedule schedule){
        return new ProfessionalScheduleResponse(
                schedule.getId(),
                schedule.getProfessionalEstablishment().getId(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getIsActive()
        );
    }

}
