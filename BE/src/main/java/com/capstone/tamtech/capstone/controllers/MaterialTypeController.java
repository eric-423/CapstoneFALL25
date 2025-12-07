package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.MaterialTypeDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.MaterialTypeRequest;
import com.capstone.tamtech.capstone.payload.request.MaterialTypeSearchRequest;
import com.capstone.tamtech.capstone.services.impl.MaterialTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/material-types")
@Tag(name = "Material Type Management", description = "API quản lý loại nguyên liệu")
public class MaterialTypeController {

    @Autowired
    private MaterialTypeService materialTypeService;

    @Operation(summary = "Lấy danh sách loại nguyên liệu (có phân trang)", description = "Trả về danh sách loại nguyên liệu với phân trang. Set includeDeleted=true để lấy cả những loại đã bị xóa.")
    @GetMapping
    public ResponseEntity<?> getMaterialTypes(MaterialTypeSearchRequest searchRequest) {
        try {
            if (searchRequest == null) {
                searchRequest = new MaterialTypeSearchRequest();
            }
            PagedResponse<MaterialTypeDTO> pagedResponse = materialTypeService.getAllMaterialTypes(searchRequest);
            ResponseData responseData = new ResponseData();
            responseData.setData(pagedResponse);
            responseData.setDesc("Retrieved " + pagedResponse.getContent().size() + " material type(s) from page "
                    + (pagedResponse.getPageNumber() + 1));
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy loại nguyên liệu theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getMaterialTypeById(
            @Parameter(description = "ID loại nguyên liệu", required = true) @PathVariable int id) {
        try {
            MaterialTypeDTO dto = materialTypeService.getMaterialTypeById(id);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Material type retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo loại nguyên liệu mới")
    @PostMapping
    public ResponseEntity<?> createMaterialType(@RequestBody MaterialTypeRequest request) {
        try {
            MaterialTypeDTO dto = materialTypeService.createMaterialType(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Material type created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật loại nguyên liệu")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMaterialType(
            @Parameter(description = "ID loại nguyên liệu", required = true) @PathVariable int id,
            @RequestBody MaterialTypeRequest request) {
        try {
            MaterialTypeDTO dto = materialTypeService.updateMaterialType(id, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Material type updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Xóa loại nguyên liệu", description = "Xóa mềm loại nguyên liệu. Không xóa được nếu đang được sử dụng.")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterialType(
            @Parameter(description = "ID loại nguyên liệu", required = true) @PathVariable int id) {
        try {
            materialTypeService.deleteMaterialType(id);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Material type deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
