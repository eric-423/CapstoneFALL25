package com.capstone.tamtech.capstone.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin sản phẩm trong danh sách tìm kiếm")
public class ProductSearchDTO implements Serializable {

    @Schema(description = "ID sản phẩm", example = "1")
    private int productId;

    @Schema(description = "Tên sản phẩm", example = "Phở Bò Tái")
    private String productName;

    @Schema(description = "Mô tả sản phẩm", example = "Phở bò tái đặc biệt với nước dùng được ninh từ xương heo")
    private String productDescription;

    @Schema(description = "Hình ảnh sản phẩm", example = "https://example.com/pho-bo.jpg")
    private String productImage;

    @Schema(description = "Giá sản phẩm", example = "55000")
    private double productPrice;

    @Schema(description = "Loại sản phẩm", example = "Món chính")
    private String productType;

    @Schema(description = "ID loại sản phẩm", example = "1")
    private int productTypeId;

    @Schema(description = "Trạng thái sản phẩm", example = "true")
    private boolean isActive;

    @Schema(description = "Số lượng tồn kho tại chi nhánh", example = "50")
    private int quantityInBranch;

    @Schema(description = "Ngày tạo sản phẩm", example = "2024-01-01T10:30:00")
    private Date createdDate;

    @Schema(description = "Ngày cập nhật sản phẩm", example = "2024-01-15T14:20:00")
    private Date updatedDate;

    @Schema(description = "Lượng calories của sản phẩm", example = "450")
    private double calories;
}
