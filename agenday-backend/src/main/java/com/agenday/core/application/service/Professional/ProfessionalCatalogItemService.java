package com.agenday.core.application.service.Professional;

import com.agenday.core.application.dto.Professional.ProfessionalCatalogItemRequest;
import com.agenday.core.application.dto.Professional.ProfessionalCatalogItemResponse;
import com.agenday.core.domain.model.Professional.ProfessionalCatalogItem;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.repository.CatalogItem.CatalogItemRepository;
import com.agenday.core.repository.Professional.ProfessionalCatalogItemRepository;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfessionalCatalogItemService {

    private final ProfessionalCatalogItemRepository repository;
    private final CatalogItemRepository catalogItemRepository;
    private final ProfessionalEstablishment professionalEstablishment;
    private final UserRepository userRepository;

    public ProfessionalCatalogItemResponse createAssociation(String emailUser, ProfessionalCatalogItemRequest){
        User user =
    }

}
