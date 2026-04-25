package com.agenday.iam.infrastructure.security;

import org.springframework.stereotype.Component;

@Component
public class GoogleTokenVerifier {

    public GoogleUser verify(String idToken) {
        // MOCK (depois integra com Google API real)
        return new GoogleUser(
                "user@email.com",
                "google-id-123",
                "Google User"
        );
    }

    public record GoogleUser(
            String email,
            String sub,
            String name
    ) {}
}