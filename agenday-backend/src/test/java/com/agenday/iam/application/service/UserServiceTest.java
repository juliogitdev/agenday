package com.agenday.iam.application.service;

import com.agenday.iam.application.dto.RegisterRequest;
import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.RoleRepository;
import com.agenday.iam.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final RoleRepository roleRepository = mock(RoleRepository.class);
    private final BCryptPasswordEncoder passwordEncoder = mock(BCryptPasswordEncoder.class);

    private final UserService userService =
            new UserService(userRepository, roleRepository, passwordEncoder);

    @Test
    void shouldEncodePasswordBeforeSaving() {
        // Arrange
        String rawPassword = "123456";
        String encodedPassword = "encoded123";
        Role roleClient = new Role();
        roleClient.setName("ROLE_CLIENT");

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.existsByEmail("teste@email.com")).thenReturn(false);
        when(roleRepository.findByName("ROLE_CLIENT")).thenReturn(Optional.of(roleClient));

        // Act
        RegisterRequest request = new RegisterRequest(

                "Teste",
                "teste@email.com",
                rawPassword,
                "87-99999-0000",
                "PE",
                "Salgueiro"
        );
        userService.register(request);

        // Assert
        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(argThat(user ->
                user.getPasswordHash().equals(encodedPassword)
                        && user.getRoles().contains(roleClient)
        ));
    }

    @Test
    void shouldAddClientRoleWhenCreatingGoogleUser() {
        Role roleClient = new Role();
        roleClient.setName("ROLE_CLIENT");

        when(userRepository.findByEmail("google@email.com")).thenReturn(Optional.empty());
        when(roleRepository.findByName("ROLE_CLIENT")).thenReturn(Optional.of(roleClient));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = userService.loginWithGoogle(
                "google@email.com",
                "google-id-123",
                "Google User"
        );

        assertThat(user.getAuthProvider()).isEqualTo("GOOGLE");
        assertThat(user.getRoles()).contains(roleClient);
        verify(userRepository).save(user);
    }

    @Test
    void shouldAddClientRoleWhenExistingGoogleUserHasNoRoles() {
        Role roleClient = new Role();
        roleClient.setName("ROLE_CLIENT");

        User existingUser = new User();
        existingUser.setEmail("google@email.com");

        when(userRepository.findByEmail("google@email.com")).thenReturn(Optional.of(existingUser));
        when(roleRepository.findByName("ROLE_CLIENT")).thenReturn(Optional.of(roleClient));

        User user = userService.loginWithGoogle(
                "google@email.com",
                "google-id-123",
                "Google User"
        );

        assertThat(user.getRoles()).contains(roleClient);
        verify(userRepository).save(existingUser);
    }
}
