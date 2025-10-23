package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "Thông tin xác thực mã OTP")
public class OtpVerifyRequest {

    @Schema(description = "Kênh đã gửi OTP (email hoặc sms)", example = "email", required = true, allowableValues = {
            "email", "sms" })
    private String channel;

    @Schema(description = "Địa chỉ email hoặc số điện thoại đã nhận OTP", example = "user@example.com", required = true)
    private String identifier;

    @Schema(description = "Mã OTP nhận được (6 số)", example = "123456", required = true)
    private String inputOtp;
}
