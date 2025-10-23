package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tiêu chí tìm kiếm và lọc sản phẩm")
public class ProductSearchRequest {

    @Schema(description = "ID chi nhánh (bắt buộc)", example = "1", required = true)
    private Integer branchId;

    @Schema(description = "Từ khóa tìm kiếm (tên sản phẩm, mô tả)", example = "phở")
    private String keyword;

    @Schema(description = "Loại sản phẩm", example = "Món chính")
    private String productType;

    @Schema(description = "Trạng thái sản phẩm (true: đang bán, false: ngừng bán)", example = "true")
    private Boolean isActive;

    @Schema(description = "Giá tối thiểu", example = "0")
    private Double minPrice;

    @Schema(description = "Giá tối đa", example = "500000")
    private Double maxPrice;

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
