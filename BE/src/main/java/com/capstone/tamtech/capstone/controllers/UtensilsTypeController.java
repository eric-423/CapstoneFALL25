package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.UtensilsTypeDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.UtensilsTypeRequest;
import com.capstone.tamtech.capstone.payload.request.UtensilsTypeSearchRequest;
import com.capstone.tamtech.capstone.services.impl.UtensilsTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/utensils-types")
@CrossOrigin(origins = "*")
@Tag(name = "Utensils Type", description = "API quản lý loại dụng cụ bếp")
public class UtensilsTypeController {

    @Autowired
    private UtensilsTypeService utensilsTypeService;

    @Operation(summary = "Danh sách loại dụng cụ bếp với phân trang & từ khóa")
    @GetMapping
    public ResponseEntity<?> getUtensilsTypes(UtensilsTypeSearchRequest searchRequest) {
        try {
            if (searchRequest == null) {
                searchRequest = new UtensilsTypeSearchRequest();
            }
            PagedResponse<UtensilsTypeDTO> paged = utensilsTypeService.getUtensilsTypes(searchRequest);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.OK.value());
            responseData.setDesc("Retrieved " + paged.getContent().size() + " utensils type(s)");
            responseData.setData(paged);
            return ResponseEntity.ok(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    @Operation(summary = "Chi tiết loại dụng cụ bếp")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUtensilsType(
            @Parameter(description = "ID loại dụng cụ", required = true) @PathVariable int id) {
        try {
            UtensilsTypeDTO dto = utensilsTypeService.getUtensilsType(id);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.OK.value());
            responseData.setDesc("Utensils type retrieved successfully");
            responseData.setData(dto);
            return ResponseEntity.ok(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    @Operation(summary = "Tạo loại dụng cụ bếp")
    @PostMapping
    public ResponseEntity<?> createUtensilsType(@RequestBody UtensilsTypeRequest request) {
        try {
            UtensilsTypeDTO dto = utensilsTypeService.createUtensilsType(request);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.CREATED.value());
            responseData.setDesc("Utensils type created successfully");
            responseData.setData(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    @Operation(summary = "Cập nhật loại dụng cụ bếp")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUtensilsType(
            @Parameter(description = "ID loại dụng cụ", required = true) @PathVariable int id,
            @RequestBody UtensilsTypeRequest request) {
        try {
            UtensilsTypeDTO dto = utensilsTypeService.updateUtensilsType(id, request);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.OK.value());
            responseData.setDesc("Utensils type updated successfully");
            responseData.setData(dto);
            return ResponseEntity.ok(responseData);
        } catch (Exception ex) {
            return buildError(ex);
        }
    }

    @Operation(summary = "Xóa loại dụng cụ bếp")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUtensilsType(
            @Parameter(description = "ID loại dụng cụ", required = true) @PathVariable int id) {
        try {
            utensilsTypeService.deleteUtensilsType(id);
            ResponseData responseData = new ResponseData();
            responseData.setStatus(HttpStatus.OK.value());
            responseData.setDesc("Utensils type deleted successfully");
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

