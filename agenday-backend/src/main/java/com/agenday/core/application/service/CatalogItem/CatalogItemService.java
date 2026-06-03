package com.agenday.core.application.service.CatalogItem;

import com.agenday.common.exception.BusinessException;
import com.agenday.core.application.dto.CatalogItem.CatalogItemRequest;
import com.agenday.core.application.dto.CatalogItem.CatalogItemResponse;
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

}
