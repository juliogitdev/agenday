package com.agenday.core.application.service.Plan;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.PlanDto.PlanCreateRequest;
import com.agenday.core.application.dto.PlanDto.PlanResponse;
import com.agenday.core.application.dto.PlanDto.PlanUpdateRequest;
import com.agenday.core.domain.model.Plan.Plan;
import com.agenday.core.mapper.Plan.PlanMapper;
import com.agenday.core.repository.Plan.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public PlanResponse getById(UUID id) {
        Plan plan = planRepository.findByIdWithLimits(id)
                .orElseThrow(() -> new BusinessException(
                        "PLAN_NOT_FOUND",
                        "Plano não encontrado.",
                        HttpStatus.NOT_FOUND)
                );
        return PlanMapper.toDTO(plan);
    }

    public List<PlanResponse> getAll() {
        return planRepository.findAllWithLimits()
                .stream()
                .map(PlanMapper::toDTO)
                .toList();
    }

    public PlanResponse create(PlanCreateRequest request) {
        Plan plan = PlanMapper.toEntity(request);
        Plan saved = planRepository.save(plan);
        return PlanMapper.toDTO(saved);
    }

    public PlanResponse update(UUID id, PlanUpdateRequest request) {
        Plan plan = planRepository.findByIdWithLimits(id)
                .orElseThrow(() -> new BusinessException(
                        "PLAN_NOT_FOUND",
                        "Não foi possível atualizar: Plano não encontrado.",
                        HttpStatus.NOT_FOUND)
                );

        PlanMapper.updateEntity(plan, request);
        Plan saved = planRepository.save(plan);
        return PlanMapper.toDTO(saved);
    }

    public void delete(UUID id) {
        Plan plan = planRepository.findByIdWithLimits(id)
                .orElseThrow(() -> new BusinessException(
                        "PLAN_NOT_FOUND",
                        "Não foi possível excluir: Plano não encontrado.",
                        HttpStatus.NOT_FOUND)
                );
        planRepository.delete(plan);
    }
}