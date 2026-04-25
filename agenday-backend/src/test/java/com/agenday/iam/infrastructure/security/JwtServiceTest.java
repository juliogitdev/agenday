package com.agenday.iam.infrastructure.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Base64;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;

@SpringBootTest
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("Deve gerar um token JWT válido")
    void shouldGenerateValidJwtToken() {
        String email = "admin@agenday.com";

        String token = jwtService.generateToken(email);

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
        String email = "admin@agenday.com";

        // Act
        String token = jwtService.generateToken(email);
        String extractedEmail = jwtService.extractUsername(token);

        // Assert
        assertThat(extractedEmail).isEqualTo(email);
    }

    @Test
    @DisplayName("Deve retornar falso quando o token estiver expirado")
    void shouldReturnFalseWhenTokenIsExpired() throws InterruptedException {
        // Arrange
        String email = "admin@agenday.com";

        // Act
        String token = jwtService.generateToken(email, 1);

        Thread.sleep(10);

        boolean isValid = jwtService.isTokenValid(token);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Deve retornar verdadeiro quando o token for válido")
    void shouldReturnTrueWhenTokenIsValid() {
        // Arrange
        String email = "admin@agenday.com";

        // Act
        String token = jwtService.generateToken(email);
        boolean isValid = jwtService.isTokenValid(token);

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Deve retornar falso quando o token for adulterado")
    void shouldReturnFalseWhenTokenIsTampered() {
        // Arrange
        String email = "admin@agenday.com";
        String token = jwtService.generateToken(email);

        String tamperedToken = token.substring(0, token.length() - 2) + "xx";

        // Act
        boolean isValid = jwtService.isTokenValid(tamperedToken);

        // Assert
        assertThat(isValid).isFalse();
    }
}