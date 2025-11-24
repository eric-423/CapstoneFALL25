package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tham số lọc & phân trang loại dụng cụ bếp")
public class UtensilsTypeSearchRequest {

    @Schema(description = "Từ khóa tìm theo tên hoặc mô tả")
    private String keyword;

    @Schema(description = "Trang (bắt đầu từ 0)", defaultValue = "0")
    private Integer page = 0;

    @Schema(description = "Số phần tử mỗi trang", defaultValue = "10")
    private Integer size = 10;

    @Schema(description = "Trường sắp xếp", example = "name")
    private String sortBy = "name";

    @Schema(description = "Hướng sắp xếp", allowableValues = { "ASC", "DESC" }, defaultValue = "ASC")
    private String sortDirection = "ASC";
}

