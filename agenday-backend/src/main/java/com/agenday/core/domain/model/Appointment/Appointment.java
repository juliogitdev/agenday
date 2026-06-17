package com.agenday.core.domain.model.Appointment;

import com.agenday.common.domain.model.BaseEntity;
import com.agenday.core.domain.enums.AppointmentStatus;
import com.agenday.core.domain.model.Professional.ProfessionalEstablishment;
import com.agenday.core.domain.model.catalogItem.CatalogItem;
import com.agenday.iam.domain.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_estab_id", nullable = false)
    private ProfessionalEstablishment professionalEstablishment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalog_item_id", nullable = false)
    private CatalogItem catalogItem;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AppointmentStatus status;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}