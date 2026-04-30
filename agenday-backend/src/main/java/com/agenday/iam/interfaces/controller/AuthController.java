package com.agenday.iam.interfaces.controller;

import com.agenday.iam.application.dto.*;
import com.agenday.iam.application.service.UserService;
import com.agenday.iam.domain.model.User;
import com.agenday.iam.infrastructure.security.GoogleTokenVerifier;
import com.agenday.iam.infrastructure.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final GoogleTokenVerifier googleVerifier;

    public AuthController(UserService userService,
                          JwtService jwtService,
                          GoogleTokenVerifier googleVerifier) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.googleVerifier = googleVerifier;
    }

    // REGISTER NORMAL
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequest request) {

        userService.register(
                request.email(),
                request.password(),
                request.fullName()
        );

        return ResponseEntity.status(201).build();
    }

    // LOGIN NORMAL
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid LoginRequest request) {

        var user = userService.login(request.email(), request.password());

        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(token);
    }

    // LOGIN GOOGLE
    @PostMapping("/google")
    public ResponseEntity<String> googleLogin(@RequestBody @Valid GoogleLoginRequest request) {

        var googleUser = googleVerifier.verify(request.idToken());

        var user = userService.loginWithGoogle(
                googleUser.email(),
                googleUser.sub(),
                googleUser.name()
        );

        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(token);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication){
        var user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(userService.toResponse(user));
    }
}