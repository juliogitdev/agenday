package com.agenday.iam.application.service;

import com.agenday.iam.application.dto.LoginRequest;
import com.agenday.iam.application.dto.RegisterRequest;
import com.agenday.iam.application.dto.UserResponse;
import com.agenday.iam.application.exception.InvalidCredentialsException;
import com.agenday.iam.application.exception.UserAlreadyExistsException;
import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.RoleRepository;
import com.agenday.iam.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException(request.email());
        }

        User user = new User();

        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setAuthProvider("LOCAL");
        user.setFullName(request.fullName());
        user.setState(request.state());
        user.setCity(request.city());

        Role roleClient = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow(()-> new RuntimeException("Erro ao buscar pela role 'ROLE_CLIENT'"));

        user.getRoles().add(roleClient);

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

        log.info("Login attempt for email: {}", request.email());

        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    log.warn("User not found: {}", request.email());
                    throw new InvalidCredentialsException();
                });

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        log.info("User authenticated successfully: {}", request.email());

        return user;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}