package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.MaterialAllBranchDTFO;
import com.capstone.tamtech.capstone.dto.MaterialAllBranchDTO;
import com.capstone.tamtech.capstone.dto.MaterialDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.MaterialRequest;
import com.capstone.tamtech.capstone.payload.request.MaterialSearchRequest;
import com.capstone.tamtech.capstone.services.impl.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
@Tag(name = "Material Management", description = "API quản lý nguyên liệu")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @Operation(summary = "Lấy danh sách nguyên liệu (có phân trang)", description = "Trả về danh sách nguyên liệu với phân trang. Set includeDeleted=true để lấy cả những nguyên liệu đã bị xóa.")
    @GetMapping
    public ResponseEntity<?> getMaterials(MaterialSearchRequest searchRequest) {
        try {
            if (searchRequest == null) {
                searchRequest = new MaterialSearchRequest();
            }
            PagedResponse<MaterialAllBranchDTO> pagedResponse = materialService.getAllMaterials(searchRequest);
            ResponseData responseData = new ResponseData();
            responseData.setData(pagedResponse);
            responseData.setDesc("Retrieved " + pagedResponse.getContent().size() + " material(s) from page "
                    + (pagedResponse.getPageNumber() + 1));
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy nguyên liệu theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getMaterialById(
            @Parameter(description = "ID nguyên liệu", required = true) @PathVariable int id) {
        try {
            MaterialDTO dto = materialService.getMaterialById(id);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Material retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo nguyên liệu mới")
    @PostMapping
    public ResponseEntity<?> createMaterial(@RequestBody MaterialRequest request) {
        try {
            MaterialAllBranchDTO dto = materialService.createMaterial(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Material created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật nguyên liệu")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMaterial(
            @Parameter(description = "ID nguyên liệu", required = true) @PathVariable int id,
            @RequestBody MaterialRequest request) {
        try {
            MaterialAllBranchDTO dto = materialService.updateMaterial(id, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Material updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Xóa nguyên liệu", description = "Xóa mềm nguyên liệu. Không xóa được nếu đang được sử dụng trong công thức sản phẩm.")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(
            @Parameter(description = "ID nguyên liệu", required = true) @PathVariable int id) {
        try {
            materialService.deleteMaterial(id);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Material deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
