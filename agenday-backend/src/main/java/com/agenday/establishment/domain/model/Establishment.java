package com.agenday.establishment.domain.model;

import com.agenday.common.domain.model.BaseEntity;
import com.agenday.iam.domain.model.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "establishment")
public class Establishment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String slogan;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "phone")
    private String numberPhone;

    @Column(name = "image_url")
    private String imageUrl;

    @Embedded
    private Address address;
}
