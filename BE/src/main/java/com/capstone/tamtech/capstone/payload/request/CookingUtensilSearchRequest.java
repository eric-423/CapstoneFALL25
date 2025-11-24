package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tham số lọc & phân trang dụng cụ bếp")
public class CookingUtensilSearchRequest {

    @Schema(description = "Từ khóa tìm kiếm theo tên dụng cụ", example = "nồi")
    private String keyword;

    @Schema(description = "Lọc theo loại dụng cụ")
    private Integer utensilsTypeId;

    @Schema(description = "Lọc theo kho")
    private Integer warehouseId;

    @Schema(description = "Trang (bắt đầu từ 0)", defaultValue = "0")
    private Integer page = 0;

    @Schema(description = "Số phần tử mỗi trang", defaultValue = "10")
    private Integer size = 10;

    @Schema(description = "Trường sắp xếp", example = "name")
    private String sortBy = "name";

    @Schema(description = "Hướng sắp xếp", allowableValues = { "ASC", "DESC" }, defaultValue = "ASC")
    private String sortDirection = "ASC";
}

