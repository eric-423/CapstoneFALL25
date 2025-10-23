package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin đăng nhập cho khách hàng")
public class CustomerLoginRequest {

    @Schema(description = "Số điện thoại của khách hàng", example = "0987654321", required = true)
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @Schema(description = "Mật khẩu", example = "password123", required = true)
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}
