package com.agenday.iam.application.service;

import com.agenday.iam.application.dto.LoginRequest;
import com.agenday.iam.application.dto.UserResponse;
import com.agenday.iam.application.exception.InvalidCredentialsException;
import com.agenday.iam.application.exception.UserAlreadyExistsException;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String email, String password, String fullName) {

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(email);
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setAuthProvider("LOCAL");
        user.setFullName(fullName);

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getPasswordHash() == null) {
            throw new InvalidCredentialsException();
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return user;
    }

    public User loginWithGoogle(String email, String providerId, String fullName) {

        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setAuthProvider("GOOGLE");
                    user.setAuthProviderId(providerId);
                    user.setFullName(fullName);
                    user.setPasswordHash(null);

                    return userRepository.save(user);
                });
    }

    public UserResponse getCurrentUser(String email){

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName()
        );
    }

    public User authenticate(LoginRequest request) {

        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {

            throw new InvalidCredentialsException();

        }

        return user;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}