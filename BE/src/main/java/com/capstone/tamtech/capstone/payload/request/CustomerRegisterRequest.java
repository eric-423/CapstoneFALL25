package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "Thông tin đăng ký tài khoản khách hàng")
public class CustomerRegisterRequest {

    @Schema(description = "Họ và tên đầy đủ của khách hàng", example = "Nguyễn Văn A", required = true)
    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;

    @Schema(description = "Mật khẩu (tối thiểu 6 ký tự)", example = "password123", required = true)
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;

    @Schema(description = "Số điện thoại (10 số, bắt đầu bằng 0)", example = "0987654321", required = true)
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @Schema(description = "Ngày sinh (định dạng: yyyy-MM-dd)", example = "2000-01-01")
    private Date dateOfBirth;

}