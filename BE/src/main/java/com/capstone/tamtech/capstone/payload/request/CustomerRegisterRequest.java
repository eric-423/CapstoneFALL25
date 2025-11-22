package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
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
    private String fullName;

    @Schema(description = "Mật khẩu (tối thiểu 6 ký tự)", example = "password123", required = true)
    private String password;

    @Schema(description = "Số điện thoại (10 số, bắt đầu bằng 0)", example = "0987654321", required = true)
    private String phoneNumber;

    @Schema(description = "Ngày sinh (định dạng: yyyy-MM-dd)", example = "2000-01-01")
    private Date dateOfBirth;

}
