package com.agenday.iam.infrastructure.security;

import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Base64;
import java.util.Set;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;

@SpringBootTest
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    private User createTestUser() {
        var user = new User();
        user.setEmail("admin@agenday.com");

        var role = new Role();
        role.setName("ROLE_CLIENT");

        user.setRoles(Set.of(role));

        return user;
    }

    @Test
    @DisplayName("Deve gerar um token JWT válido")
    void shouldGenerateValidJwtToken() {
        // Arrange
        User user = createTestUser();

        String token = jwtService.generateToken(user);

        assertThat(token).isNotBlank();

        String[] parts = token.split("\\.");
        assertThat(parts).hasSize(3);

        assertThatCode(() -> Base64.getUrlDecoder().decode(parts[0]))
                .doesNotThrowAnyException();

        assertThatCode(() -> Base64.getUrlDecoder().decode(parts[1]))
                .doesNotThrowAnyException();

        assertThat(parts[2]).isNotBlank();
    }

    @Test
    @DisplayName("Deve extrair corretamente o email do token")
    void shouldExtractCorrectUsernameFromToken() {
        // Arrange
        User user = createTestUser();

        // Act
        String token = jwtService.generateToken(user);
        String extractedEmail = jwtService.extractUsername(token);

        // Assert
        assertThat(extractedEmail).isEqualTo(user);
    }

    @Test
    @DisplayName("Deve retornar falso quando o token estiver expirado")
    void shouldReturnFalseWhenTokenIsExpired() throws InterruptedException {
        // Arrange
        User user = createTestUser();

        // Act
        String token = jwtService.generateToken(user, 1);

        Thread.sleep(10);

        boolean isValid = jwtService.isTokenValid(token, user);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Deve retornar verdadeiro quando o token for válido")
    void shouldReturnTrueWhenTokenIsValid() {
        // Arrange
        User user = createTestUser();

        // Act
        String token = jwtService.generateToken(user);
        boolean isValid = jwtService.isTokenValid(token, user);

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Deve retornar falso quando o token for adulterado")
    void shouldReturnFalseWhenTokenIsTampered() {
        // Arrange
        User user = createTestUser();
        String token = jwtService.generateToken(user);

        String tamperedToken = token.substring(0, token.length() - 2) + "xx";

        // Act
        boolean isValid = jwtService.isTokenValid(tamperedToken, user);

        // Assert
        assertThat(isValid).isFalse();
    }
}