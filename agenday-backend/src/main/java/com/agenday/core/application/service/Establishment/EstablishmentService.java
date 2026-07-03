package com.agenday.core.application.service.Establishment;

import com.agenday.common.exception.BusinessException;
import com.agenday.common.utils.SlugUtils;
import com.agenday.core.application.dto.Establishment.*;
import com.agenday.core.application.dto.Professional.ProfessionalEstablishmentRequest;
import com.agenday.core.application.service.Professional.ProfessionalEstablishmentService;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.domain.model.Plan.Plan;
import com.agenday.core.domain.model.Plan.PlanLimit;
import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.core.domain.model.Professional.ProfessionalCatalogItem;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.domain.model.Professional.ProfessionalSubscription;
import com.agenday.core.mapper.Establishment.EstablishmentDetailsMapper;
import com.agenday.core.mapper.Establishment.EstablishmentMapper;
import com.agenday.core.mapper.Establishment.EstablishmentSummaryMapper;
import com.agenday.core.repository.Establishment.EstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalCatalogItemRepository;
import com.agenday.core.repository.Professional.ProfessionalEstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalRepository;
import com.agenday.core.repository.Professional.ProfessionalSubscriptionRepository;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.infrastructure.Store.MinioStorageService;
import com.agenday.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstablishmentService {

    private final EstablishmentRepository establishmentRepository;
    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final ProfessionalSubscriptionRepository subscriptionRepository;
    private final MinioStorageService minioStorageService;
    private final ProfessionalEstablishmentService professionalEstablishmentService;
    private final ProfessionalCatalogItemRepository professionalCatalogItemRepository;



    public EstablishmentResponse createEstablishment(EstablishmentRequest establishmentRequest,
                                                     Authentication authentication) {

        String emailUser = authentication.getName();

        User user = userRepository.findByEmail(emailUser)
                .orElseThrow(() -> new BusinessException(
                        "USER_NOT_FOUND",
                        "Usuário não encontrado.",
                        HttpStatus.NOT_FOUND)
                );

        Professional professional = professionalRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(
                        "NOT_A_PROFESSIONAL",
                        "Você precisa ter um perfil profissional para cadastrar um estabelecimento.",
                        HttpStatus.FORBIDDEN)
                );

        ProfessionalSubscription subscription = subscriptionRepository.findByProfessionalWithPlanAndLimits(professional)
                .orElseThrow(() -> new BusinessException(
                        "PLAN_NOT_FOUND",
                        "Nenhum plano ativo encontrado para este profissional.",
                        HttpStatus.BAD_REQUEST)
                );

        Plan activePlan = subscription.getPlan();
        PlanLimit establishmentsLimit = activePlan.getLimits().stream()
                .filter(limit -> "MAX_ESTABLISHMENTS".equals(limit.getKey()))
                .findFirst()
                .orElseThrow(() -> new BusinessException(
                        "LIMIT_CONFIG_ERROR",
                        "Configuração de restrição do plano não encontrada.",
                        HttpStatus.INTERNAL_SERVER_ERROR
                ));

        int maxAllowed = Integer.parseInt(establishmentsLimit.getValue());
        if (maxAllowed != -1) {
            long currentCount = establishmentRepository.countByOwnerId(user.getId());

            if (currentCount >= maxAllowed) {
                throw new BusinessException(
                        "PLAN_LIMIT_EXCEEDED",
                        "Você atingiu o limite máximo de " + maxAllowed + " estabelecimentos permitidos pelo seu plano " + activePlan.getName() + ".",
                        HttpStatus.FORBIDDEN
                );
            }
        }

        if (establishmentRepository.existsByNumberPhone(establishmentRequest.numberPhone())) {
            throw new BusinessException(
                    "DUPLICATE_PHONE",
                    "Este número de telefone já está registrado.",
                    HttpStatus.CONFLICT
            );
        }

        Establishment newEstablishment = EstablishmentMapper.toEntity(establishmentRequest);
        newEstablishment.setOwner(user);
        newEstablishment.setSlug(generateUniqueSlug(newEstablishment.getName()));
        newEstablishment = establishmentRepository.save(newEstablishment);

        //Cria vínculo entre o estabelecimento e o dono
        professionalEstablishmentService.linkProfessional(
                new ProfessionalEstablishmentRequest(newEstablishment.getId(), emailUser),
                authentication
        );

        return EstablishmentMapper.toDTO(newEstablishment);
    }

    public List<EstablishmentResponse> getAll() {
        return establishmentRepository.findAll()
                .stream()
                .map(EstablishmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EstablishmentResponse updateEstablishment(UUID id, String emailUser, EstablishmentRequest request) {
        Establishment establishment = establishmentRepository.findByIdWithOwner(id)
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado.",
                        HttpStatus.NOT_FOUND)
                );

        if (!establishment.getOwner().getEmail().equals(emailUser)) {
            throw new BusinessException(
                    "ACCESS_DENIED",
                    "Você não tem permissão para editar este estabelecimento.",
                    HttpStatus.FORBIDDEN
            );
        }

        EstablishmentMapper.updateEntity(establishment, request);
        return EstablishmentMapper.toDTO(establishmentRepository.save(establishment));
    }

    public EstablishmentResponse getById(UUID id) {
        Establishment establishment = establishmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado.",
                        HttpStatus.NOT_FOUND)
                );
        return EstablishmentMapper.toDTO(establishment);
    }

    public GetPresignedUploadUrlResponse getPresignedUploadUrl(UUID id, String emailUser, String originalFilename) {
        // Buscando com findByIdWithOwner para evitar LazyInitializationException no getOwner()
        Establishment establishment = establishmentRepository.findByIdWithOwner(id)
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado.",
                        HttpStatus.NOT_FOUND)
                );

        if (!establishment.getOwner().getEmail().equals(emailUser)) {
            throw new BusinessException(
                    "ACCESS_DENIED",
                    "Você não tem permissão para modificar este estabelecimento.",
                    HttpStatus.FORBIDDEN
            );
        }

        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";

        String filename = id.toString() + "-logo" + extension;
        String folder = "establishments/";
        String objectName = folder + filename;

        try {
            String uploadUrl = minioStorageService.generatePresignedUploadUrl("agenday-images", objectName, 15);
            establishment.setImageUrl(objectName);
            establishmentRepository.save(establishment);
            return new GetPresignedUploadUrlResponse(uploadUrl, objectName);
        } catch (Exception exception) {
            throw new BusinessException(
                    "UPLOAD_LINK_ERROR",
                    "Erro ao gerar link de upload: " + exception.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Transactional
    public List<EstablishmentResponse> getEstablishmentsByProfessional(String emailUser) {
        return establishmentRepository.findByOwnerEmailAndIsActiveTrue(emailUser)
                .stream()
                .map(EstablishmentMapper::toDTO)
                .collect(Collectors.toList());
    }


    public List<EstablishmentSummaryResponse> getEstablishmentsByProfessionalSummary(String emailUser) {
        return establishmentRepository.findByOwnerEmailAndIsActiveTrue(emailUser)
                .stream()
                .map(EstablishmentSummaryMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Transactional
    public void softDelete(UUID id, String emailUser) {
        Establishment establishment = establishmentRepository.findByIdAndIsActiveTrue(id)
            .orElseThrow(() -> new BusinessException(
                    "ESTABLISHMENT_NOT_FOUND",
                    "Estabelecimento não encontrado.",
                    HttpStatus.NOT_FOUND)
            );

        if (!establishment.getOwner().getEmail().equals(emailUser)) {
            throw new BusinessException(
                "ACCESS_DENIED",
                "Você não tem permissão para excluir este estabelecimento.",
                HttpStatus.FORBIDDEN
            );
        }

        establishment.setIsActive(false);
    }

    @Transactional
    public EstablishmentDetailsResponse getDetailsBySlug(String slug) {
        Establishment establishment = establishmentRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado.",
                        HttpStatus.NOT_FOUND)
                );

        List<ProfessionalCatalogItem> items =
                professionalCatalogItemRepository.findActiveByEstablishmentId(establishment.getId());

        return EstablishmentDetailsMapper.toDTO(establishment, items);
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = SlugUtils.toSlug(name);
        String slug = baseSlug;
        int suffix = 1;

        while (establishmentRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + suffix++;
        }
        return slug;
    }


}