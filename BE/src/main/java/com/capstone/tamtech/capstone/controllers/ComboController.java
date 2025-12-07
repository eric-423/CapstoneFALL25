package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.ComboDTO;
import com.capstone.tamtech.capstone.dto.ComboSearchDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.ComboSearchRequest;
import com.capstone.tamtech.capstone.payload.request.CreateComboRequest;
import com.capstone.tamtech.capstone.payload.request.UpdateComboRequest;
import com.capstone.tamtech.capstone.services.impl.ComboService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/combos")
@CrossOrigin(origins = "*")
@Tag(name = "Combo Management", description = "API quản lý combo")
public class ComboController {

    @Autowired
    private ComboService comboService;

    @Operation(summary = "Tìm kiếm combo", description = "Tìm kiếm, lọc, sắp xếp và phân trang danh sách combo. Có thể lọc theo chi nhánh, từ khóa, sản phẩm nằm trong combo, trạng thái, khoảng giá.")
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<ComboSearchDTO>> searchCombos(
            @Parameter(description = "ID chi nhánh", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Từ khóa tìm kiếm (theo tên và mô tả combo)", example = "gia đình") @RequestParam(required = false) String keyword,

            @Parameter(description = "Tên món trong combo", example = "Cơm tấm") @RequestParam(required = false) String productName,

            @Parameter(description = "Trạng thái combo (true: đang hoạt động, false: ngừng)", example = "true") @RequestParam(required = false) Boolean isActive,

            @Parameter(description = "Giá tối thiểu", example = "0") @RequestParam(required = false) Double minPrice,

            @Parameter(description = "Giá tối đa", example = "1000000") @RequestParam(required = false) Double maxPrice,

            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0") @RequestParam(required = false, defaultValue = "0") Integer page,

            @Parameter(description = "Số lượng mỗi trang (tối đa 100)", example = "10") @RequestParam(required = false, defaultValue = "10") Integer size,

            @Parameter(description = "Trường sắp xếp", example = "name", schema = @Schema(allowableValues = { "name",
                    "price", "startDate",
                    "endDate" })) @RequestParam(required = false, defaultValue = "name") String sortBy,

            @Parameter(description = "Hướng sắp xếp", example = "ASC", schema = @Schema(allowableValues = { "ASC",
                    "DESC" })) @RequestParam(required = false, defaultValue = "ASC") String sortDirection) {
        ComboSearchRequest request = new ComboSearchRequest();
        request.setBranchId(branchId);
        request.setKeyword(keyword);
        request.setProductName(productName);
        request.setIsActive(isActive);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setPage(page);
        request.setSize(size);
        request.setSortBy(sortBy);
        request.setSortDirection(sortDirection);

        PagedResponse<ComboSearchDTO> response = comboService.searchCombos(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Lấy combo theo ID", description = "Lấy thông tin chi tiết của combo bao gồm danh sách sản phẩm trong combo.")
    @GetMapping("/{comboId}")
    public ResponseEntity<?> getComboById(
            @Parameter(description = "ID của combo", required = true) @PathVariable int comboId) {
        try {
            ComboDTO combo = comboService.getComboById(comboId);
            ResponseData responseData = new ResponseData();
            responseData.setData(combo);
            responseData.setDesc("Combo retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo combo mới", description = "Tạo combo mới với danh sách sản phẩm trong combo.")
    @PostMapping
    public ResponseEntity<?> createCombo(@RequestBody CreateComboRequest request) {
        try {
            ComboDTO combo = comboService.createCombo(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(combo);
            responseData.setDesc("Combo created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật combo", description = "Cập nhật thông tin combo. Nếu truyền comboItems, sẽ xóa các item cũ và tạo lại.")
    @PutMapping("/{comboId}")
    public ResponseEntity<?> updateCombo(
            @Parameter(description = "ID của combo", required = true) @PathVariable int comboId,
            @RequestBody UpdateComboRequest request) {
        try {
            ComboDTO combo = comboService.updateCombo(comboId, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(combo);
            responseData.setDesc("Combo updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Xóa combo", description = "Xóa combo. Nếu combo đang được sử dụng trong đơn hàng, sẽ set isActive = false thay vì xóa.")
    @DeleteMapping("/{comboId}")
    public ResponseEntity<?> deleteCombo(
            @Parameter(description = "ID của combo", required = true) @PathVariable int comboId) {
        try {
            comboService.deleteCombo(comboId);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Combo deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
