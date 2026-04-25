package com.agenday.iam.application.service;

import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final BCryptPasswordEncoder passwordEncoder = mock(BCryptPasswordEncoder.class);

    private final UserService userService =
            new UserService(userRepository, passwordEncoder);

    @Test
    void shouldEncodePasswordBeforeSaving() {
        // Arrange
        String rawPassword = "123456";
        String encodedPassword = "encoded123";

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);

        // Act
        userService.register("test@email.com", rawPassword, "Julio");

        // Assert
        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(argThat(user ->
                user.getPasswordHash().equals(encodedPassword)
        ));
    }
}