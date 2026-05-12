package com.agenday.iam.interfaces.controller;

import com.agenday.iam.application.dto.RegisterRequest;
import com.agenday.iam.application.dto.UserResponse;
import com.agenday.iam.application.exception.UserAlreadyExistsException;
import com.agenday.iam.application.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturn400WhenEmailIsInvalid() throws Exception {
        RegisterRequest request = new RegisterRequest(

                "Teste",
                "email-invalido",
                "123456",
                "87-99999-0000",
                "PE",
                "Salgueiro"
        );

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn409WhenUserAlreadyExists() throws Exception {

        doThrow(new UserAlreadyExistsException("test@email.com"))
                .when(userService)
                .register(any());

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "email": "test@email.com",
                          "password": "123456",
                          "fullName": "Julio",
                          "numberPhone": "87-99999-0000",
                          "state": "PE",
                          "city": "Salgueiro"
                        }
                    """))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(username = "client@email.com", authorities = "ROLE_CLIENT")
    void shouldReturnCurrentUserWhenAuthenticatedClientCallsMe() throws Exception {
        UUID userId = UUID.randomUUID();

        when(userService.getCurrentUser("client@email.com"))
                .thenReturn(new UserResponse(userId, "client@email.com", "Cliente Teste"));

        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid").value(userId.toString()))
                .andExpect(jsonPath("$.email").value("client@email.com"))
                .andExpect(jsonPath("$.fullName").value("Cliente Teste"));
    }

    @Test
    void shouldReturn401WhenMeIsCalledWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "professional@email.com", authorities = "ROLE_PROFESSIONAL")
    void shouldReturnCurrentUserWhenAuthenticatedUserCallsMeWithoutClientRole() throws Exception {
        UUID userId = UUID.randomUUID();

        when(userService.getCurrentUser("professional@email.com"))
                .thenReturn(new UserResponse(userId, "professional@email.com", "Profissional Teste"));

        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid").value(userId.toString()))
                .andExpect(jsonPath("$.email").value("professional@email.com"))
                .andExpect(jsonPath("$.fullName").value("Profissional Teste"));
    }
}
