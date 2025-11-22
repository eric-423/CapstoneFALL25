package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "Thông tin đăng ký tài khoản nhân viên")
public class EmployeeRegisterRequest {

    @Schema(description = "Họ và tên đầy đủ của nhân viên", example = "Trần Thị B", required = true)
    private String fullName;

    @Schema(description = "Mật khẩu (tối thiểu 6 ký tự)", example = "password123", required = true)
    private String password;

    @Schema(description = "Email công ty", example = "employee@tamtech.com", required = true)
    private String email;

    @Schema(description = "Địa chỉ liên hệ", example = "123 Đường ABC, Quận 1, TP.HCM")
    private String address;

    @Schema(description = "Số điện thoại (10 số, bắt đầu bằng 0)", example = "0987654321", required = true)
    private String phoneNumber;

    @Schema(description = "Ngày sinh (định dạng: yyyy-MM-dd)", example = "1995-01-01")
    private Date dateOfBirth;

    @Schema(description = "Mã vai trò của nhân viên (1: Admin, 2: Manager, 3: Staff)", example = "2", required = true)
    private int roleId;
}
