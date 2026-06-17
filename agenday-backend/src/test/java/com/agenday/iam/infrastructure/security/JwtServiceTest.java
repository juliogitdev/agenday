package com.agenday.iam.infrastructure.security;

import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Base64;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

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
        var user = createTestUser();
        var token = jwtService.generateToken(user);

        assertThat(token).isNotBlank();

        String[] parts = token.split("\\.");
        assertThat(parts).hasSize(3);

        assertThatCode(() -> Base64.getUrlDecoder().decode(parts[0])).doesNotThrowAnyException();
        assertThatCode(() -> Base64.getUrlDecoder().decode(parts[1])).doesNotThrowAnyException();
        assertThat(parts[2]).isNotBlank();
    }

    @Test
    void shouldExtractCorrectUsernameFromToken() {
        var user = createTestUser();
        var token = jwtService.generateToken(user);

        var extracted = jwtService.extractUsername(token);

        assertThat(extracted).isEqualTo(user.getEmail());
    }

    @Test
    void shouldReturnFalseWhenTokenIsExpired() throws InterruptedException {
        var user = createTestUser();
        var token = jwtService.generateToken(user, 1);

        Thread.sleep(10);

        assertThat(jwtService.isTokenValid(token, user)).isFalse();
    }

    @Test
    void shouldReturnTrueWhenTokenIsValid() {
        var user = createTestUser();
        var token = jwtService.generateToken(user);

        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }

    @Test
    void shouldReturnFalseWhenTokenIsTampered() {
        var user = createTestUser();
        var token = jwtService.generateToken(user);

        var tampered = token.substring(0, token.length() - 2) + "xx";

        assertThat(jwtService.isTokenValid(tampered, user)).isFalse();
    }
}