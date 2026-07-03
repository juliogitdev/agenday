package com.agenday.iam.application.service;

import com.agenday.common.exception.BusinessException;
import com.agenday.iam.application.dto.*;
import com.agenday.iam.domain.model.PasswordResetToken;
import com.agenday.iam.domain.model.Role;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.repository.PasswordResetTokenRepository;
import com.agenday.iam.repository.RoleRepository;
import com.agenday.iam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public User register(RegisterRequest request) {
        // Substituído UserAlreadyExistsException por BusinessException (409 Conflict)
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(
                    "USER_ALREADY_EXISTS",
                    "O e-mail '" + request.email() + "' já está cadastrado no sistema.",
                    HttpStatus.CONFLICT
            );
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setAuthProvider("LOCAL");
        user.setFullName(request.fullName());
        user.setState(request.state());
        user.setCity(request.city());

        Role roleClient = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow(() -> new BusinessException(
                        "ROLE_NOT_FOUND",
                        "Erro interno: a permissão inválida.",
                        HttpStatus.INTERNAL_SERVER_ERROR
                ));

        user.getRoles().add(roleClient);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        // Substituído InvalidCredentialsException por BusinessException (401 Unauthorized)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(
                        "INVALID_CREDENTIALS",
                        "E-mail ou senha incorretos.",
                        HttpStatus.UNAUTHORIZED
                ));

        if (user.getPasswordHash() == null) {
            throw new BusinessException(
                    "INVALID_CREDENTIALS",
                    "Usuário cadastrado via provedor externo. Faça login com o Google.",
                    HttpStatus.UNAUTHORIZED
            );
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BusinessException(
                    "INVALID_CREDENTIALS",
                    "E-mail ou senha incorretos.",
                    HttpStatus.UNAUTHORIZED
            );
        }

        return user;
    }

    public User loginWithGoogle(String email, String providerId, String fullName) {
        Role roleClient = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow(() -> new BusinessException(
                        "ROLE_NOT_FOUND",
                        "Erro interno: a permissão inválida",
                        HttpStatus.INTERNAL_SERVER_ERROR
                ));

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User userDB = new User();
                    userDB.setEmail(email);
                    userDB.setAuthProvider("GOOGLE");
                    userDB.setAuthProviderId(providerId);
                    userDB.setFullName(fullName);
                    userDB.setPasswordHash(null);
                    userDB.getRoles().add(roleClient);
                    return userRepository.save(userDB);
                });

        if (user.getRoles().isEmpty()) {
            user.getRoles().add(roleClient);
            userRepository.save(user);
        }

        return user;
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(
                        "USER_NOT_FOUND",
                        "Usuário não encontrado.",
                        HttpStatus.NOT_FOUND
                ));

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getProfileImageUrl()
        );
    }

    public User authenticate(LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    log.warn("User not found: {}", request.email());
                    return new BusinessException(
                            "INVALID_CREDENTIALS",
                            "E-mail ou senha incorretos.",
                            HttpStatus.UNAUTHORIZED
                    );
                });

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException(
                    "INVALID_CREDENTIALS",
                    "E-mail ou senha incorretos.",
                    HttpStatus.UNAUTHORIZED
            );
        }

        log.info("User authenticated successfully: {}", request.email());
        return user;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(
                        "USER_NOT_FOUND",
                        "Usuário não encontrado.",
                        HttpStatus.NOT_FOUND
                ));
    }

    @Transactional
    public void requestPasswordReset(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(
                        "USER_NOT_FOUND",
                        "E-mail não encontrado no sistema.",
                        HttpStatus.NOT_FOUND
                ));

        // Validação: Usuário Google não pode resetar senha local
        if (!"LOCAL".equals(user.getAuthProvider())) {
            throw new BusinessException(
                    "GOOGLE_USER_CANNOT_RESET_PASSWORD",
                    "Usuários cadastrados via Google não podem redefinir a senha pelo sistema.",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Invalida tokens anteriores (opcional, mas recomendado)
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Gera novo token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(1)); // Expira em 1 hora
        passwordResetTokenRepository.save(resetToken);

        // TODO: Enviar email com o token
        // Por enquanto apenas log
        log.info("========================================");
        log.info("TOKEN DE RESET DE SENHA PARA: {}", user.getEmail());
        log.info("TOKEN: {}", token);
        log.info("Expira em: 1 hora");
        log.info("========================================");
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new BusinessException(
                        "INVALID_TOKEN",
                        "Token inválido ou não encontrado.",
                        HttpStatus.BAD_REQUEST
                ));

        if (resetToken.isUsed()) {
            throw new BusinessException(
                    "TOKEN_ALREADY_USED",
                    "Este token já foi utilizado.",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (resetToken.isExpired()) {
            throw new BusinessException(
                    "TOKEN_EXPIRED",
                    "Este token expirou. Solicite um novo.",
                    HttpStatus.BAD_REQUEST
            );
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        // Marca o token como usado
        resetToken.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);
    }
}