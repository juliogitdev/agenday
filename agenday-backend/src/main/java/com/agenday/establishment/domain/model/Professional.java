package com.agenday.establishment.domain.model;

import com.agenday.common.domain.model.BaseEntity;
import com.agenday.iam.domain.model.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "professionals")
@Data
public class Professional extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String bio;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

}
