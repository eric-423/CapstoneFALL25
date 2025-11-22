package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request tìm kiếm và phân trang nguyên liệu")
public class MaterialSearchRequest {

    @Schema(description = "Bao gồm các nguyên liệu đã bị xóa", example = "false", defaultValue = "false")
    private Boolean includeDeleted = false;

    @Schema(description = "Số trang (bắt đầu từ 0)", example = "0", defaultValue = "0")
    private Integer page = 0;

    @Schema(description = "Số lượng phần tử mỗi trang", example = "10", defaultValue = "10")
    private Integer size = 10;

    @Schema(description = "Trường sắp xếp", example = "name", allowableValues = { "name", "id", "materialType",
            "createdDate" }, defaultValue = "name")
    private String sortBy = "name";

    @Schema(description = "Hướng sắp xếp", example = "ASC", allowableValues = { "ASC", "DESC" }, defaultValue = "ASC")
    private String sortDirection = "ASC";
}
