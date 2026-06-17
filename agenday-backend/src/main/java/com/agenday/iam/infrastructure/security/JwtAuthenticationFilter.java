package com.agenday.iam.infrastructure.security;

import com.agenday.iam.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Libera imediatamente as requisições de Preflight (CORS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // 2. Verifica se o header de autenticação está presente e correto
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        String username;

        // 3. Tenta extrair o username do token
        try {
            username = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Verifica se o usuário já não está autenticado no contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userOpt = userRepository.findByEmail(username);

            if (userOpt.isPresent() && jwtService.isAccessTokenValid(jwt, userOpt.get())) {
                var user = userOpt.get();

                var roles = jwtService.extractRoles(jwt);
                var authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList();

                // Import limpo usando a classe do Spring Security importada no topo
                var userDetails = new User(
                        user.getEmail(),
                        user.getPasswordHash() != null ? user.getPasswordHash() : "",
                        authorities
                );

                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 5. Continua o fluxo para o próximo filtro
        filterChain.doFilter(request, response);
    }
}
