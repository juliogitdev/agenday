

package com.agenday.core.mapper.Plan;
import com.agenday.core.application.dto.PlanDto.PlanCreateRequest;
import com.agenday.core.application.dto.PlanDto.PlanLimitResponse;
import com.agenday.core.application.dto.PlanDto.PlanResponse;
import com.agenday.core.application.dto.PlanDto.PlanUpdateRequest;
import com.agenday.core.domain.model.Plan.Plan;
import com.agenday.core.domain.model.Plan.PlanLimit;

import java.util.List;

public class PlanMapper {
   public static PlanResponse toDTO(Plan plan) {
        List<PlanLimitResponse> limits = plan.getLimits() == null
                ? List.of()
                : plan.getLimits().stream()
                    .map(limit -> new PlanLimitResponse(
                            limit.getId(),
                            limit.getKey(),
                            limit.getValue()
                    ))
                    .toList();
        return new PlanResponse(
                plan.getId(),
                plan.getName(),
                plan.getDescription(),
                plan.getPrice(),
                plan.getDurationDays(),
                plan.getIsActive(),
                limits
        );
    }

    public static Plan toEntity(PlanCreateRequest request) {
        Plan plan = new Plan();
        plan.setName(request.name());
        plan.setDescription(request.description());
        plan.setPrice(request.price());
        plan.setDurationDays(request.durationDays());
        plan.setIsActive(request.isActive() != null ? request.isActive() : true);

        if (request.limits() != null) {
            List<PlanLimit> limits = request.limits()
                    .stream()
                    .map(limitReq -> {
                        PlanLimit limit = new PlanLimit();
                        limit.setKey(limitReq.key());
                        limit.setValue(limitReq.value());
                        limit.setPlan(plan);
                        return limit;
                    })
                    .toList();

            plan.setLimits(limits);
        }
        return plan;
    }


     public static void updateEntity(Plan plan, PlanUpdateRequest request) {
        if (request.name() != null) { plan.setName(request.name());}
        if (request.description() != null) { plan.setDescription(request.description());}
        if (request.price() != null) { plan.setPrice(request.price());}
        if (request.durationDays() != null) { plan.setDurationDays(request.durationDays());}
        if (request.isActive() != null) { plan.setIsActive(request.isActive());}
        if (request.limits() != null) {
            plan.getLimits().clear();
            List<PlanLimit> updatedLimits = request.limits()
                .stream().map(limitReq -> {
                    PlanLimit limit = new PlanLimit();
                    limit.setKey(limitReq.key());
                    limit.setValue(limitReq.value());
                    limit.setPlan(plan);
                    return limit;
                }).toList();
            plan.getLimits().addAll(updatedLimits);
        }
    }
}