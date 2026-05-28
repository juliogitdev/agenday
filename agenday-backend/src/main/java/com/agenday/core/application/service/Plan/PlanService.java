
package com.agenday.core.application.service;
import com.agenday.core.application.dto.*;
import com.agenday.core.application.dto.PlanDto.PlanCreateRequest;
import com.agenday.core.application.dto.PlanDto.PlanLimitResponse;
import com.agenday.core.application.dto.PlanDto.PlanResponse;
import com.agenday.core.application.dto.PlanDto.PlanUpdateRequest;
import com.agenday.core.domain.model.Plan.Plan;
import com.agenday.core.mapper.PlanMapper;
import com.agenday.core.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PlanService {
    private final PlanRepository planRepository;
    public PlanService(PlanRepository planRepository) {this.planRepository = planRepository;}

    public PlanResponse getById(UUID id) {
        Plan plan = planRepository.findByIdWithLimits(id).orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        return PlanMapper.toDTO(plan);
    }

    public List<PlanResponse> getAll() {
        return planRepository.findAllWithLimits().stream().map(PlanMapper::toDTO).toList();
    }

    public PlanResponse create(PlanCreateRequest request) {
        Plan plan = PlanMapper.toEntity(request);
        Plan saved = planRepository.save(plan);
        return PlanMapper.toDTO(saved);
    }

    public PlanResponse update(UUID id, PlanUpdateRequest request) {
        Plan plan = planRepository.findByIdWithLimits(id).orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        PlanMapper.updateEntity(plan, request);
        Plan saved = planRepository.save(plan);
        return PlanMapper.toDTO(saved);
    }

    public void delete(UUID id) {
        Plan plan = planRepository.findByIdWithLimits(id).orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        planRepository.delete(plan);
    }
}