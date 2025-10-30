package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class InformationRequest {
    @Schema(description = "Tên người nhận")
    private String name;

    @Schema(description = "Địa chỉ")
    private String address;

    @Schema(description = "Số điện thoại")
    private String phoneNumber;

    @Schema(description = "Đặt làm mặc định")
    private Boolean isDefault;
}


