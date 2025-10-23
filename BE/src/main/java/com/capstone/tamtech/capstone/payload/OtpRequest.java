package com.capstone.tamtech.capstone.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@AllArgsConstructor
@Schema(description = "Thông tin yêu cầu gửi mã OTP")
public class OtpRequest {

    @Schema(description = "Kênh gửi OTP (email hoặc sms)", example = "email", required = true, allowableValues = {
            "email", "sms" })
    private String channel;

    @Schema(description = "Địa chỉ email hoặc số điện thoại nhận OTP", example = "user@example.com", required = true)
    private String indentifier;
}
