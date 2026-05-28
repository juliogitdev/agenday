package com.agenday.core.domain.model.Establishment;

import com.agenday.common.domain.model.BaseEntity;
import com.agenday.core.domain.model.Address.Address;
import com.agenday.iam.domain.model.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(
    name = "establishment",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_establishment_address",
            columnNames = {"cep", "state", "city", "street","number","neighborhood"}
        )
    }
)
@EqualsAndHashCode(callSuper = false)
public class Establishment extends BaseEntity {
    @Id  @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false)  private String name;

    private String slogan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "phone", unique = true, nullable = false)
    private String numberPhone;

    @Column(name = "image_url") private String imageUrl;
    @Embedded private Address address;
    @Column(nullable = false) private Short template = 1;
    @Column(length = 50) private String palette;
}