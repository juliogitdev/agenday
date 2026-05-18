package com.agenday.establishment.mapper;

import com.agenday.establishment.application.dto.ProfessionalRequest;
import com.agenday.establishment.application.dto.ProfessionalResponse;
import com.agenday.establishment.domain.model.Professional;
import com.agenday.iam.domain.model.User;

public class ProfessionalMapper {

    private ProfessionalMapper() {
    }

    public static ProfessionalResponse toDTO(Professional professional) {
        if (professional == null) {
            throw new IllegalArgumentException("Professional cannot be null");
        }

        User user = professional.getUser();

        return new ProfessionalResponse(
                professional.getId(),
                user != null ? user.getFullName() : null,
                professional.getBio(),
                professional.getProfileImageUrl()
        );
    }

    public static Professional toEntity(ProfessionalRequest request, User user) {
        if (request == null) {
            throw new IllegalArgumentException("Professional request cannot be null");
        }

        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        Professional professional = new Professional();
        professional.setUser(user);
        updateEntity(professional, request);

        return professional;
    }

    public static void updateEntity(Professional professional, ProfessionalRequest request) {
        if (professional == null) {
            throw new IllegalArgumentException("Professional cannot be null");
        }

        if (request == null) {
            throw new IllegalArgumentException("Professional request cannot be null");
        }

        professional.setBio(request.bio());
        professional.setProfileImageUrl(request.profileImageUrl());
    }

}
