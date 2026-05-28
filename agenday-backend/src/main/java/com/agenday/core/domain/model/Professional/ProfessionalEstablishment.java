package com.agenday.core.domain.model;


import com.agenday.common.domain.model.BaseEntity;
import com.agenday.core.domain.enums.LinkStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "professional_establishment")
@Data
public class ProfessionalEstablishment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "professional_id", nullable = false)
    private Professional professional;

    @ManyToOne
    @JoinColumn(name = "establishment_id", nullable = false)
    private Establishment establishment;

    @Enumerated(EnumType.STRING)
    private LinkStatus status; // PENDING, ACTIVE, INACTIVE

    private LocalDateTime linkedAt;
}