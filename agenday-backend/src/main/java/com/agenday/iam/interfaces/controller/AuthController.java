package com.agenday.iam.interfaces.controller;

import com.agenday.iam.application.dto.*;
import com.agenday.iam.application.service.UserService;
import com.agenday.iam.infrastructure.security.GoogleTokenVerifier;
import com.agenday.iam.infrastructure.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
<<<<<<< HEAD
@CrossOrigin(origins = "http://localhost:5173")
=======
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
>>>>>>> origin/feature/establishment
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
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request, HttpServletResponse response) {

        var user = userService.authenticate(request);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        addRefreshTokenCookie(response, refreshToken); // adiciona o refresh_token no cookie
        return ResponseEntity.ok(
                new AuthResponse(accessToken, "Bearer")
        );

    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody @Valid GoogleLoginRequest request, HttpServletResponse response) {

        var googleUser = googleVerifier.verify(request.idToken());

        var user = userService.loginWithGoogle(
                googleUser.email(),
                googleUser.sub(),
                googleUser.name()
        );

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        addRefreshTokenCookie(response, refreshToken); // adiciona o refresh_token no cookie

        return ResponseEntity.ok (
                new AuthResponse(accessToken, "Bearer")
        );
    }

    @PostMapping("/refresh")
	public ResponseEntity<AuthResponse> refresh (
			@CookieValue(name = "AGD_RFTK", required = false)
        	String refreshToken,
        	HttpServletResponse response
		) {

    	if (refreshToken == null) { return ResponseEntity.status(401).build();}
    	String email;

        try { email = jwtService.extractUsername(refreshToken);
        } catch (Exception e)  {
            return ResponseEntity.status(401).build();
        }

	    var user = userService.getUserByEmail(email);

    	if (!jwtService.isRefreshTokenValid(refreshToken, user))  return ResponseEntity.status(401).build();

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        addRefreshTokenCookie(response, newRefreshToken);

        return ResponseEntity.ok (
            new AuthResponse(newAccessToken, "Bearer")
        );
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> me(Authentication authentication){

        var userDetails = (UserDetails) authentication.getPrincipal();

        String email = userDetails.getUsername();

        return ResponseEntity.ok(userService.getCurrentUser(email));
    }

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletResponse response) {
    	ResponseCookie cookie = ResponseCookie.from("AGD_RFTK", "")
            .httpOnly(true)
            .secure(false) // true em produção HTTPS
            .path("/")
            .sameSite("Lax")
            .maxAge(0)
            .build();

    	response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    	return ResponseEntity.ok().build();
    }

    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("AGD_RFTK", refreshToken)
            .httpOnly(true)
            .secure(false) // true em produção HTTPS
            .path("/")
            .sameSite("Strict")
            .maxAge(7 * 24 * 60 * 60)
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
