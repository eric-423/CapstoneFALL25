package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.MaterialWarehouseDTO;
import com.capstone.tamtech.capstone.dto.WarehouseDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.AddMaterialToWarehouseRequest;
import com.capstone.tamtech.capstone.payload.request.WarehouseRequest;
import com.capstone.tamtech.capstone.services.impl.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "*")
@Tag(name = "Warehouse Management", description = "API quản lý kho")
public class WarehouseController {

    @Autowired
    private WarehouseService warehouseService;

    @Operation(summary = "Lấy danh sách tất cả kho", description = "Trả về danh sách tất cả kho trong hệ thống")
    @GetMapping
    public ResponseEntity<?> getAllWarehouses() {
        try {
            List<WarehouseDTO> warehouses = warehouseService.getAllWarehouses();

            ResponseData responseData = new ResponseData();
            responseData.setData(warehouses);
            responseData.setDesc("Retrieved " + warehouses.size() + " warehouse(s) successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy thông tin kho theo ID", description = "Trả về thông tin chi tiết của một kho")
    @GetMapping("/{warehouseId}")
    public ResponseEntity<?> getWarehouseById(
            @Parameter(description = "ID của kho", required = true) @PathVariable int warehouseId) {
        try {
            WarehouseDTO warehouse = warehouseService.getWarehouseById(warehouseId);

            ResponseData responseData = new ResponseData();
            responseData.setData(warehouse);
            responseData.setDesc("Warehouse retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy danh sách vật liệu trong kho", description = "Trả về danh sách tất cả vật liệu và số lượng trong kho")
    @GetMapping("/{warehouseId}/materials")
    public ResponseEntity<?> getMaterialsInWarehouse(
            @Parameter(description = "ID của kho", required = true) @PathVariable int warehouseId) {
        try {
            List<MaterialWarehouseDTO> materials = warehouseService.getMaterialsInWarehouse(warehouseId);

            ResponseData responseData = new ResponseData();
            responseData.setData(materials);
            responseData.setDesc("Retrieved " + materials.size() + " material(s) in warehouse");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo kho mới", description = "Tạo một kho mới cho chi nhánh")
    @PostMapping
    public ResponseEntity<?> createWarehouse(@RequestBody WarehouseRequest request) {
        try {
            WarehouseDTO warehouse = warehouseService.createWarehouse(request);

            ResponseData responseData = new ResponseData();
            responseData.setData(warehouse);
            responseData.setDesc("Warehouse created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật thông tin kho", description = "Cập nhật thông tin của một kho")
    @PutMapping("/{warehouseId}")
    public ResponseEntity<?> updateWarehouse(
            @Parameter(description = "ID của kho", required = true) @PathVariable int warehouseId,
            @RequestBody WarehouseRequest request) {
        try {
            WarehouseDTO warehouse = warehouseService.updateWarehouse(warehouseId, request);

            ResponseData responseData = new ResponseData();
            responseData.setData(warehouse);
            responseData.setDesc("Warehouse updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Thêm vật liệu vào kho", description = "Thêm một hoặc nhiều vật liệu vào kho với số lượng. Nếu vật liệu đã có trong kho, sẽ cộng thêm số lượng.")
    @PostMapping("/{warehouseId}/materials")
    public ResponseEntity<?> addMaterialsToWarehouse(
            @Parameter(description = "ID của kho", required = true) @PathVariable int warehouseId,
            @RequestBody AddMaterialToWarehouseRequest request) {
        try {
            List<MaterialWarehouseDTO> results = warehouseService.addMaterialsToWarehouse(warehouseId, request);

            ResponseData responseData = new ResponseData();
            responseData.setData(results);
            responseData.setDesc("Added " + results.size() + " material(s) to warehouse successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Update vật liệu trong kho")
    @PutMapping("/{warehouseId}/materials")
    public ResponseEntity<?> updateMaterialsToWarehouse(
            @Parameter(description = "ID của kho", required = true) @PathVariable int warehouseId,
            @RequestBody AddMaterialToWarehouseRequest request) {
        try {
            List<MaterialWarehouseDTO> results = warehouseService.updateMaterialWarehouse(warehouseId, request);

            ResponseData responseData = new ResponseData();
            responseData.setData(results);
            responseData.setDesc("Added " + results.size() + " material(s) to warehouse successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
