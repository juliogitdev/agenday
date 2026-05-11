package com.agenday.iam.application.service;

import com.agenday.iam.application.dto.RegisterRequest;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.RoleRepository;
import com.agenday.iam.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);

        // Act
        RegisterRequest request = new RegisterRequest(

                "Teste",
                "teste@email.com",
                encodedPassword,
                "87-99999-0000",
                "PE",
                "Salgueiro"
        );
        userService.register(request);

        // Assert
        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(argThat(user ->
                user.getPasswordHash().equals(encodedPassword)
        ));
    }
}