package com.agenday.iam.infrastructure.security;

import com.agenday.iam.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String ACCESS_TOKEN_TYPE = "ACCESS";
    private static final String REFRESH_TOKEN_TYPE = "REFRESH";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;


    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    public String generateToken(User user) {
        return generateToken(user, accessTokenExpiration, ACCESS_TOKEN_TYPE);
    }

    public String generateToken(User user, long expirationMillis) {
        return generateToken(user, expirationMillis, ACCESS_TOKEN_TYPE);
    }

    private String generateToken(User user, long expirationMillis, String tokenType) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("type", tokenType)
                .claim("roles", user.getRoles()
                        .stream()
                        .map(role -> role.getName())
                        .toList()
                )
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(getSignInKey())
                .compact();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public List<String> extractRoles(String token){
        var claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }

    public boolean isAccessTokenValid(String token, User user) {
        return isTokenValid(token, user, ACCESS_TOKEN_TYPE);
    }

    public boolean isRefreshTokenValid(String token, User user) {
        return isTokenValid(token, user, REFRESH_TOKEN_TYPE);
    }

    public boolean isTokenValid(String token, User user) {
        return isAccessTokenValid(token, user);
    }

    private boolean isTokenValid(String token, User user, String expectedType) {
        try {
            final String username = extractUsername(token);
            return username.equals(user.getEmail())
                    && expectedType.equals(extractTokenType(token))
                    && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, refreshTokenExpiration, REFRESH_TOKEN_TYPE);
    }

}
