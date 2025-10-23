package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Phản hồi đăng nhập thành công")
public class LoginResponse {

    @Schema(description = "JWT token để xác thực các request tiếp theo", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Builder.Default
    @Schema(description = "Loại token", example = "Bearer", defaultValue = "Bearer")
    private String tokenType = "Bearer";

    @Schema(description = "Thời gian hết hạn của token (tính bằng giây)", example = "3600")
    private Long expiresIn;

    @Schema(description = "Thông tin người dùng")
    private UserInfo userInfo;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "Thông tin chi tiết người dùng")
    public static class UserInfo {
        @Schema(description = "ID người dùng", example = "1")
        private int id;

        @Schema(description = "Họ và tên đầy đủ", example = "Nguyễn Văn A")
        private String fullName;

        @Schema(description = "Email", example = "user@example.com")
        private String email;

        @Schema(description = "Số điện thoại", example = "0987654321")
        private String phoneNumber;

        @Schema(description = "Địa chỉ", example = "123 Đường ABC, Quận 1, TP.HCM")
        private String address;

        @Schema(description = "Vai trò của người dùng", example = "CUSTOMER")
        private String role;

        @Schema(description = "Điểm thành viên tích lũy", example = "100")
        private int memberPoint;
    }
}
