package com.agenday.common.dto;

import com.agenday.core.domain.model.Establishment.Establishment;
import com.agenday.core.domain.model.Professional.ProfessionalSubscription;
import com.agenday.iam.domain.model.User;

public record OwnerContext(
        User user,
        Establishment establishment,
        ProfessionalSubscription subscription
) {
}
