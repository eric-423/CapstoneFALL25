package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.config.JwtAuthenticationFilter;
import com.capstone.tamtech.capstone.config.SecurityConfig;
import com.capstone.tamtech.capstone.config.SockJSCorsFilter;
import com.capstone.tamtech.capstone.dto.UserDTO;
import com.capstone.tamtech.capstone.exception.GlobalExceptionHandler;
import com.capstone.tamtech.capstone.services.impl.AuthService;
import com.capstone.tamtech.capstone.services.impl.OtpService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = AuthController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {SecurityConfig.class, JwtAuthenticationFilter.class, SockJSCorsFilter.class}))
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerCustomerRegisterTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private OtpService otpService;

    private static final String REGISTER_URL = "/auth/customer/register";

    @Test
    void test001Ct01_missingFullName() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phoneNumber\":\"0987654321\",\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details[0]").value(org.hamcrest.Matchers.containsString("fullName")));
    }

    @Test
    void test001Ct02_missingPhoneNumber() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Nguyễn Văn A\",\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details[0]").value(org.hamcrest.Matchers.containsString("phoneNumber")));
    }

    @Test
    void test001Ct03_missingPassword() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Nguyễn Văn A\",\"phoneNumber\":\"0987654321\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details[0]").value(org.hamcrest.Matchers.containsString("password")));
    }

    @Test
    void test001Ct04_invalidPhoneFormat() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Nguyễn Văn A\",\"phoneNumber\":\"987654321\",\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details[0]").value(org.hamcrest.Matchers.containsString("phoneNumber")));
    }

    @Test
    void test001Ct05_invalidPhoneElevenDigits() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Nguyễn Văn A\",\"phoneNumber\":\"12345678901\",\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details[0]").value(org.hamcrest.Matchers.containsString("phoneNumber")));
    }

    @Test
    void test001Ct06_passwordTooShort() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Nguyễn Văn A\",\"phoneNumber\":\"0987654321\",\"password\":\"12345\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details[0]").value(org.hamcrest.Matchers.containsString("password")));
    }

    @Test
    void test001Ct07_fullNameTooLong() throws Exception {
        String longName = "a".repeat(101);
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format(
                                "{\"fullName\":\"%s\",\"phoneNumber\":\"0987654321\",\"password\":\"password123\"}",
                                longName)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details[0]").value(org.hamcrest.Matchers.containsString("fullName")));
    }

    @Test
    void test001Ct08_validMinimalBody() throws Exception {
        UserDTO dto = new UserDTO();
        dto.setId(1);
        dto.setFullName("Nguyễn Văn A");
        dto.setPhone("0987654321");
        dto.setRole("CUSTOMER");
        dto.setCreatedAt(new Date());
        dto.setPhoneVerified(false);
        when(authService.customerRegister(any())).thenReturn(dto);

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Nguyễn Văn A\",\"phoneNumber\":\"0987654321\",\"password\":\"password123\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }

    @Test
    void test001Ct09_errorResponseShapeOnValidation() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phoneNumber\":\"0987654321\",\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.message").value("Dữ liệu đầu vào không hợp lệ"))
                .andExpect(jsonPath("$.path").value(REGISTER_URL))
                .andExpect(jsonPath("$.details").isArray());
    }

    @Test
    void test001Ct10_duplicatePhoneViaService() throws Exception {
        when(authService.customerRegister(any()))
                .thenThrow(new IllegalArgumentException("Số điện thoại đã tồn tại: 0987654321"));

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Nguyễn Văn A\",\"phoneNumber\":\"0987654321\",\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Số điện thoại đã tồn tại: 0987654321"))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    void test001Ct11_malformedDateOfBirth() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Nguyễn Văn A\",\"phoneNumber\":\"0987654321\",\"password\":\"password123\",\"dateOfBirth\":\"not-a-date\"}"))
                .andExpect(status().isBadRequest());
    }
}