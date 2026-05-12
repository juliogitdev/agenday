package com.agenday.iam.interfaces.controller;

import com.agenday.iam.application.dto.*;
import com.agenday.iam.application.service.UserService;
import com.agenday.iam.infrastructure.security.GoogleTokenVerifier;
import com.agenday.iam.infrastructure.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")
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

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequest request) {

        userService.register(request);

        return ResponseEntity.status(201).build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {

        var user = userService.authenticate(request);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(
                new AuthResponse(accessToken, refreshToken, "Bearer")
        );

    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody @Valid GoogleLoginRequest request) {

        var googleUser = googleVerifier.verify(request.idToken());

        var user = userService.loginWithGoogle(
                googleUser.email(),
                googleUser.sub(),
                googleUser.name()
        );

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);


        return ResponseEntity.ok(
                new AuthResponse(accessToken, refreshToken, "Bearer")
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {

        String refreshToken = request.refreshToken();
        String email;

        try {
            email = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }

        var user = userService.getUserByEmail(email);

        if (!jwtService.isRefreshTokenValid(refreshToken, user)) {
            return ResponseEntity.status(401).build();
        }

        String newAccessToken = jwtService.generateToken(user);

        return ResponseEntity.ok(
                new AuthResponse(newAccessToken, refreshToken, "Bearer")
        );
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> me(Authentication authentication){

        var userDetails = (UserDetails) authentication.getPrincipal();

        String email = userDetails.getUsername();

        return ResponseEntity.ok(userService.getCurrentUser(email));
    }
}
