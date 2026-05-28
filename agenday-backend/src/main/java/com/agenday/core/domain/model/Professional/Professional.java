package com.agenday.core.domain.model;

import com.agenday.common.domain.model.BaseEntity;
import com.agenday.iam.domain.model.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "professionals")
@Data
public class Professional extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "working_since")
    private LocalDate workingSince;

    @Column(name = "instagram_url")
    private String instagramUrl;

    @Column(name = "specialized_in")
    private String specializedIn;
}