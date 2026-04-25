package com.agenday.iam.interfaces.controller;

import com.agenday.iam.application.dto.RegisterRequest;
import com.agenday.iam.application.exception.UserAlreadyExistsException;
import com.agenday.iam.application.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturn400WhenEmailIsInvalid() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "email-invalido",
                "123456",
                "agenday"
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
                .register(any(), any(), any());

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "email": "test@email.com",
                          "password": "123456",
                          "fullName": "Julio"
                        }
                    """))
                .andExpect(status().isConflict());
    }
}