package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CookingMethodSearchRequest {

    @Schema(description = "Từ khóa tìm kiếm (tên phương pháp nấu, mô tả)")
    private String keyword;

    @Schema(description = "Số trang (bắt đầu từ 0)", example = "0", defaultValue = "0")
    private Integer page = 0;

    @Schema(description = "Số lượng sản phẩm mỗi trang", example = "10", defaultValue = "10")
    private Integer size = 10;

    @Schema(description = "Trường sắp xếp", example = "name", allowableValues = { "name", "price", "createdDate",
            "productType" }, defaultValue = "name")
    private String sortBy = "name";

    @Schema(description = "Hướng sắp xếp", example = "ASC", allowableValues = { "ASC", "DESC" }, defaultValue = "ASC")
    private String sortDirection = "ASC";
}
