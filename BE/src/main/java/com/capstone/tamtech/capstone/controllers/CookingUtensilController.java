package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.CookingUtensilDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.CookingUtensilRequest;
import com.capstone.tamtech.capstone.payload.request.CookingUtensilSearchRequest;
import com.capstone.tamtech.capstone.services.impl.CookingUtensilService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cooking-utensils")
@CrossOrigin(origins = "*")
@Tag(name = "Cooking Utensils", description = "API quản lý dụng cụ bếp")
public class CookingUtensilController {

    @Autowired
    private CookingUtensilService cookingUtensilService;

    @Operation(summary = "Danh sách dụng cụ bếp với phân trang & bộ lọc")
    @GetMapping
    public ResponseEntity<?> getCookingUtensils(CookingUtensilSearchRequest searchRequest) {
        try {
            if (searchRequest == null) {
                searchRequest = new CookingUtensilSearchRequest();
            }
            PagedResponse<CookingUtensilDTO> paged = cookingUtensilService.getCookingUtensils(searchRequest);

            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.OK.value());
            responseData.setDesc("Retrieved " + paged.getContent().size() + " utensil(s)");
            responseData.setData(paged);

            return ResponseEntity.ok(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    @Operation(summary = "Chi tiết dụng cụ bếp theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getCookingUtensil(
            @Parameter(description = "ID dụng cụ", required = true) @PathVariable int id) {
        try {
            CookingUtensilDTO dto = cookingUtensilService.getCookingUtensil(id);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.OK.value());
            responseData.setDesc("Cooking utensil retrieved successfully");
            responseData.setData(dto);
            return ResponseEntity.ok(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    @Operation(summary = "Tạo dụng cụ bếp")
    @PostMapping
    public ResponseEntity<?> createCookingUtensil(@RequestBody CookingUtensilRequest request) {
        try {
            CookingUtensilDTO dto = cookingUtensilService.createCookingUtensil(request);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.CREATED.value());
            responseData.setDesc("Cooking utensil created successfully");
            responseData.setData(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    @Operation(summary = "Cập nhật dụng cụ bếp")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCookingUtensil(
            @Parameter(description = "ID dụng cụ", required = true) @PathVariable int id,
            @RequestBody CookingUtensilRequest request) {
        try {
            CookingUtensilDTO dto = cookingUtensilService.updateCookingUtensil(id, request);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.OK.value());
            responseData.setDesc("Cooking utensil updated successfully");
            responseData.setData(dto);
            return ResponseEntity.ok(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    @Operation(summary = "Xóa dụng cụ bếp")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCookingUtensil(
            @Parameter(description = "ID dụng cụ", required = true) @PathVariable int id) {
        try {
            cookingUtensilService.deleteCookingUtensil(id);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.OK.value());
            responseData.setDesc("Cooking utensil deleted successfully");
            return ResponseEntity.ok(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    private ResponseEntity<ResponseData> buildError(Exception ex) {
        ResponseData responseData = new ResponseData();
        responseData.setStatus(HttpStatus.BAD_REQUEST.value());
        responseData.setDesc("Error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
    }
}

