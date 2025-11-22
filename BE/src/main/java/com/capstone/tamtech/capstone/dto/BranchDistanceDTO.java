package com.capstone.tamtech.capstone.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin chi nhánh kèm khoảng cách tới địa chỉ người dùng")
public class BranchDistanceDTO {

    @Schema(description = "ID chi nhánh", example = "1")
    private int branchId;

    @Schema(description = "Tên chi nhánh")
    private String name;

    @Schema(description = "Địa chỉ chi nhánh")
    private String address;

    @Schema(description = "Số điện thoại chi nhánh")
    private String phoneNumber;

    @Schema(description = "Có phải chi nhánh chính hay không")
    private Boolean isParent;

    @Schema(description = "Khoảng cách tính bằng mét", example = "1250")
    private long distanceInMeters;

    @Schema(description = "Khoảng cách dạng text, ví dụ '1.25 km'")
    private String distanceText;
}


