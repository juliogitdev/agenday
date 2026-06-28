package com.agenday.core.application.service.CatalogItem;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.CatalogItem.*;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.domain.model.catalogItem.CatalogItem;
import com.agenday.core.mapper.CatalogItem.CatalogItemMapper;
import com.agenday.core.repository.CatalogItem.CatalogItemRepository;
import com.agenday.core.repository.Establishment.EstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalCatalogItemRepository;
import com.agenday.core.repository.Professional.ProfessionalEstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalRepository;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogItemService {

    private final CatalogItemRepository catalogItemRepository;
    private final EstablishmentRepository establishmentRepository;
    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;
    private final ProfessionalEstablishmentRepository professionalEstablishmentRepository;
    private final ProfessionalCatalogItemRepository professionalCatalogItemRepository;

    @Transactional
    public CatalogItemResponse createCatalogItem(String emailUser, CatalogItemRequest request){
        User user = userRepository.findByEmail(emailUser).orElseThrow(() -> new BusinessException(
                "USER_NOT_FOUND",
                "Usuário não encontrado",
                HttpStatus.NOT_FOUND
        ));

        Professional professional = professionalRepository.findByUser(user).orElseThrow(() -> new BusinessException(
           "NOT_A_PROFESSIONAL",
           "Você precisa ter um perfil profissional",
           HttpStatus.FORBIDDEN
        ));

        Establishment establishment = establishmentRepository.findById(request.id_establishment()).orElseThrow(() -> new BusinessException(
           "ESTABLISHMENT_NOT_FOUND",
           "Estabelecimento não encontrado",
           HttpStatus.NOT_FOUND
        ));

        if(!establishment.getOwner().equals(user)){
            throw new BusinessException(
                    "ESTABLISHMENT_NOT_PERMISSION",
                    "Apenas o dono tem permissão!",
                    HttpStatus.FORBIDDEN
            );
        }

        CatalogItem catalogItem = CatalogItemMapper.toEntity(request);
        catalogItem.setEstablishment(establishment);

        return CatalogItemMapper.toDTO(
                catalogItemRepository.save(catalogItem)
        );
    }

    @Transactional
    public void deleteCatalogItem(String email, UUID idCatalogItem){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new BusinessException(
                "USER_NOT_FOUND",
                "Usuário não encontrado",
                HttpStatus.NOT_FOUND
        ));

        CatalogItem catalog = catalogItemRepository.findById(idCatalogItem).orElseThrow(() -> new BusinessException(
                "CATALOG_NOT_FOUND",
                "Serviço não encontrado",
                HttpStatus.NOT_FOUND
        ));

        Establishment establishment = catalog.getEstablishment();

        if(!establishment.getOwner().equals(user)){
            throw new BusinessException(
                    "ACCESS_DENIED",
                    "Você não tem acesso para deletar",
                    HttpStatus.FORBIDDEN
            );
        }

        catalog.setIsActive(false);
    }

    @Transactional
    public CatalogItemResponse updateCatalogItem(String email, CatalogItemUpdateRequest request, UUID catalogItemID){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new BusinessException(
                "USER_NOT_FOUND",
                "Usuário não encontrado",
                HttpStatus.NOT_FOUND
        ));

        CatalogItem catalog = catalogItemRepository.findById(catalogItemID)
                .orElseThrow(() -> new BusinessException(
                   "CATALOG_NOT_FOUND",
                   "Serviço não encontrado",
                        HttpStatus.NOT_FOUND
                ));

        Establishment establishment = catalog.getEstablishment();

        if(!establishment.getOwner().equals(user)){
            throw new BusinessException(
                    "ACCESS_DENIED",
                    "Você não tem acesso para editar",
                    HttpStatus.FORBIDDEN
            );
        }

        catalog = CatalogItemMapper.updateEntity(catalog, request);

        return CatalogItemMapper.toDTO(catalog);


    }

    @Transactional(readOnly = true)
    public List<CatalogItemResponse> listByEstablishment(String email, UUID establishmentId){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new BusinessException(
                "USER_NOT_FOUND",
                "Usuário não encontrado",
                HttpStatus.NOT_FOUND
        ));

        Establishment establishment =  establishmentRepository.findByIdAndIsActiveTrue(establishmentId).orElseThrow(() -> new BusinessException(
                "ESTABLISHMENT_NOT_FOUND",
                "Estabelecimento não encontrado",
                HttpStatus.NOT_FOUND
        ));

        if(!establishment.getOwner().equals(user)){
            throw new BusinessException(
                    "ACCESS_DENIED",
                    "Você não tem acesso para acessar esse estabelecimento",
                    HttpStatus.FORBIDDEN
            );
        };

        return catalogItemRepository.findByEstablishmentIdAndIsActiveTrue(establishmentId)
                .stream()
                .map(CatalogItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProfessionalWithServiceStatusResponse> getProfessionalsWithServiceStatus(
            String loggedUserEmail,
            ProfessionalServiceStatusRequest request) {

        UUID establishmentId = request.establishmentId();
        UUID catalogItemId = request.catalogItemId();

        // 1. Validar acesso ao estabelecimento - CORRIGIDO
        Establishment establishment = establishmentRepository.findByIdAndIsActiveTrue(establishmentId)
                .orElseThrow(() -> new BusinessException(
                        "ESTABLISHMENT_NOT_FOUND",
                        "Estabelecimento não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        if (!establishment.getOwner().getEmail().equals(loggedUserEmail)) {
            throw new BusinessException(
                    "ACCESS_DENIED",
                    "Você não tem permissão para visualizar os profissionais deste estabelecimento.",
                    HttpStatus.FORBIDDEN
            );
        }

        // 2. Verificar se o serviço existe e pertence ao estabelecimento
        CatalogItem catalogItem = catalogItemRepository.findById(catalogItemId)
                .orElseThrow(() -> new BusinessException(
                        "CATALOG_ITEM_NOT_FOUND",
                        "Serviço não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        if (!catalogItem.getEstablishment().getId().equals(establishmentId)) {
            throw new BusinessException(
                    "CATALOG_ITEM_WRONG_ESTABLISHMENT",
                    "Este serviço não pertence a este estabelecimento.",
                    HttpStatus.BAD_REQUEST
            );
        }

        // 3. Buscar todos os profissionais ativos do estabelecimento
        List<ProfessionalEstablishment> allProfessionals = professionalEstablishmentRepository
                .findByEstablishmentIdAndIsActiveTrueWithDetails(establishmentId);

        // 4. Buscar IDs dos profissionais que já estão vinculados a este serviço
        Set<UUID> linkedProfessionalIds = professionalCatalogItemRepository
                .findByCatalogItemIdAndIsActiveTrue(catalogItemId)
                .stream()
                .map(association -> association.getProfessionalEstablishment().getProfessional().getId())
                .collect(Collectors.toSet());

        // 5. Montar resposta com flag de vínculo
        return allProfessionals.stream()
                .map(profEstab -> {
                    Professional professional = profEstab.getProfessional();
                    boolean isLinked = linkedProfessionalIds.contains(professional.getId());

                    return new ProfessionalWithServiceStatusResponse(
                            professional.getId(),
                            professional.getUser().getFullName(),
                            professional.getUser().getProfileImageUrl(),
                            profEstab.getId(),
                            isLinked
                    );
                })
                .collect(Collectors.toList());
    }
}
