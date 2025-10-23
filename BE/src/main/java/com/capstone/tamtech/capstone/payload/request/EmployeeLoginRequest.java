package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin đăng nhập cho nhân viên")
public class EmployeeLoginRequest {

    @Schema(description = "Email của nhân viên", example = "employee@tamtech.com", required = true)
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Schema(description = "Mật khẩu", example = "password123", required = true)
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}
