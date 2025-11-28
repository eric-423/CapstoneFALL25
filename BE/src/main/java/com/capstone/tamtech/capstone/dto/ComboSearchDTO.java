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
@Schema(description = "Thông tin combo trong danh sách tìm kiếm")
public class ComboSearchDTO implements Serializable {

    @Schema(description = "ID combo", example = "1")
    private int comboId;

    @Schema(description = "Tên combo", example = "Combo cơm tấm 2 người")
    private String name;

    @Schema(description = "Mô tả combo", example = "2 phần cơm tấm sườn + 2 chanh muối")
    private String description;

    @Schema(description = "Giá combo", example = "110000")
    private Double price;

    @Schema(description = "Trạng thái hoạt động", example = "true")
    private boolean isActive;

    @Schema(description = "Ngày bắt đầu áp dụng")
    private Date startDate;

    @Schema(description = "Ngày kết thúc áp dụng")
    private Date endDate;

    @Schema(description = "ID chi nhánh")
    private Integer branchId;

    @Schema(description = "Tên chi nhánh")
    private String branchName;

    @Schema(description = "Có đủ nguyên liệu để nấu không", example = "true")
    private boolean isInStock;
}


