package com.agenday.core.domain.model.Professional;

import com.agenday.common.domain.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "professional_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfessionalSchedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_estab_id", nullable = false)
    private ProfessionalEstablishment professionalEstablishment;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
}