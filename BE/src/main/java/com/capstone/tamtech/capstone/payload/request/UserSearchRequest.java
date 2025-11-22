package com.capstone.tamtech.capstone.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request tìm kiếm và phân trang người dùng")
public class UserSearchRequest {

    @Schema(description = "Từ khóa tìm kiếm (tìm trong tên, số điện thoại, email)", example = "Nguyễn Văn")
    private String keyword;

    @Schema(description = "Filter theo role name (ADMIN, MANAGER, CHEFF, WAITER, SHIPPER, CUSTOMER)", example = "ADMIN")
    private String role;

    @Schema(description = "Filter theo branch ID", example = "1")
    private Integer branchId;

    @Schema(description = "Filter theo trạng thái (true: bị ban, false: không bị ban)", example = "false")
    private Boolean status;

    @Schema(description = "Số trang (bắt đầu từ 0)", example = "0", defaultValue = "0")
    private Integer page = 0;

    @Schema(description = "Số lượng phần tử mỗi trang", example = "10", defaultValue = "10")
    private Integer size = 10;

    @Schema(description = "Trường sắp xếp", example = "id", allowableValues = { "id", "fullName", "email",
            "phoneNumber", "createdAt" }, defaultValue = "id")
    private String sortBy = "id";

    @Schema(description = "Hướng sắp xếp", example = "ASC", allowableValues = { "ASC", "DESC" }, defaultValue = "ASC")
    private String sortDirection = "ASC";
}
