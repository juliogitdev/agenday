package com.agenday.iam.repository;

import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;


    @Test
    @DisplayName("Deve salvar um usuário com sucesso e gerar o UUID")
    void shouldSaveUserAndGenerateUuid() {
        // Arrange
        User newUser = new User();
        newUser.setEmail("teste@agenday.com");
        newUser.setPasswordHash("hashed_password");
        newUser.setAuthProvider("LOCAL");

        // Act
        User savedUser = userRepository.save(newUser);

        // Assert
        assertThat(savedUser.getId()).isNotNull(); // Verifica se o UUID foi gerado
        assertThat(savedUser.getEmail()).isEqualTo("teste@agenday.com");
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar salvar e-mail duplicado")
    void shouldThrowExceptionWhenEmailIsDuplicated() {
        // Arrange
        User user1 = new User();
        user1.setEmail("duplicado@agenday.com");
        user1.setPasswordHash("hash1");
        user1.setAuthProvider("LOCAL");
        userRepository.save(user1); // Salva o primeiro com sucesso

        User user2 = new User();
        user2.setEmail("duplicado@agenday.com"); // Mesmo e-mail
        user2.setPasswordHash("hash2");
        user2.setAuthProvider("LOCAL");

        // Act & Assert
        assertThatThrownBy(() -> userRepository.saveAndFlush(user2))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("Deve salvar um usuário associado a múltiplas Roles")
    void shouldSaveUserWithMultipleRoles() {
        // Arrange

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow();

        Role clientRole = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow();

        User user = new User();
        user.setEmail("admin@agenday.com");
        user.setPasswordHash("hash");
        user.setAuthProvider("LOCAL");
        user.setRoles(Set.of(adminRole, clientRole));

        // Act
        User savedUser = userRepository.save(user);

        // Assert
        assertThat(savedUser.getRoles()).hasSize(2);
        assertThat(savedUser.getRoles())
                .extracting(Role::getName)
                .contains("ROLE_ADMIN", "ROLE_CLIENT");
    }

    @BeforeEach
    void setup() {
        Role admin = new Role();
        admin.setName("ROLE_ADMIN");

        Role client = new Role();
        client.setName("ROLE_CLIENT");

        roleRepository.saveAll(List.of(admin, client));
    }
}