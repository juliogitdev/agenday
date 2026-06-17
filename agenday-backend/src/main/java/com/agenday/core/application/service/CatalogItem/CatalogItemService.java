package com.agenday.core.application.service.CatalogItem;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.CatalogItem.CatalogItemRequest;
import com.agenday.core.application.dto.CatalogItem.CatalogItemResponse;
import com.agenday.core.application.dto.CatalogItem.CatalogItemUpdateRequest;
import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.domain.model.Professional.Professional;
import com.agenday.core.domain.model.catalogItem.CatalogItem;
import com.agenday.core.mapper.CatalogItem.CatalogItemMapper;
import com.agenday.core.repository.CatalogItem.CatalogItemRepository;
import com.agenday.core.repository.Establishment.EstablishmentRepository;
import com.agenday.core.repository.Professional.ProfessionalRepository;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CatalogItemService {

    private final CatalogItemRepository catalogItemRepository;
    private final EstablishmentRepository establishmentRepository;
    private final UserRepository userRepository;
    private final ProfessionalRepository professionalRepository;

    public CatalogItemService(
            CatalogItemRepository catalogItemRepository,
            EstablishmentRepository establishmentRepository,
            UserRepository userRepository,
            ProfessionalRepository professionalRepository
    ){
        this.catalogItemRepository = catalogItemRepository;
        this.establishmentRepository = establishmentRepository;
        this.userRepository = userRepository;
        this.professionalRepository = professionalRepository;
    }

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
}
