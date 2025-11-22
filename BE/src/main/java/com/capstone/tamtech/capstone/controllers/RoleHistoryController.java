package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.RoleHistoryDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.RoleHistoryCreateRequest;
import com.capstone.tamtech.capstone.payload.request.RoleHistoryUpdateRequest;
import com.capstone.tamtech.capstone.services.impl.RoleHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role-histories")
@CrossOrigin(origins = "*")
@Tag(name = "Role History Management", description = "API quản lý lịch sử vai trò người dùng (Chỉ dành cho ADMIN)")
public class RoleHistoryController {

    @Autowired
    private RoleHistoryService roleHistoryService;

    @Operation(summary = "Lấy tất cả lịch sử vai trò", description = "Trả về danh sách tất cả lịch sử vai trò trong hệ thống")
    @GetMapping
    public ResponseEntity<?> getAllRoleHistories() {
        try {
            List<RoleHistoryDTO> roleHistories = roleHistoryService.getAllRoleHistories();
            ResponseData responseData = new ResponseData();
            responseData.setData(roleHistories);
            responseData.setDesc("Retrieved " + roleHistories.size() + " role history(ies)");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy lịch sử vai trò theo User ID", description = "Trả về danh sách lịch sử vai trò của một user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRoleHistoriesByUserId(
            @Parameter(description = "ID người dùng", required = true) @PathVariable int userId) {
        try {
            List<RoleHistoryDTO> roleHistories = roleHistoryService.getRoleHistoriesByUserId(userId);
            ResponseData responseData = new ResponseData();
            responseData.setData(roleHistories);
            responseData.setDesc("Retrieved " + roleHistories.size() + " role history(ies) for user " + userId);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy vai trò đang active của user", description = "Trả về vai trò đang active của một user")
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<?> getActiveRoleHistoryByUserId(
            @Parameter(description = "ID người dùng", required = true) @PathVariable int userId) {
        try {
            RoleHistoryDTO roleHistory = roleHistoryService.getActiveRoleHistoryByUserId(userId);
            ResponseData responseData = new ResponseData();
            responseData.setData(roleHistory);
            responseData.setDesc("Active role history retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy lịch sử vai trò theo ID")
    @GetMapping("/{roleHistoryId}")
    public ResponseEntity<?> getRoleHistoryById(
            @Parameter(description = "ID lịch sử vai trò", required = true) @PathVariable int roleHistoryId) {
        try {
            RoleHistoryDTO roleHistory = roleHistoryService.getRoleHistoryById(roleHistoryId);
            ResponseData responseData = new ResponseData();
            responseData.setData(roleHistory);
            responseData.setDesc("Role history retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo lịch sử vai trò mới", description = "Tạo vai trò mới cho user. Tự động deactivate vai trò cũ nếu có.")
    @PostMapping
    public ResponseEntity<?> createRoleHistory(@RequestBody RoleHistoryCreateRequest request) {
        try {
            RoleHistoryDTO roleHistory = roleHistoryService.createRoleHistory(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(roleHistory);
            responseData.setDesc("Role history created successfully. Old role has been deactivated if exists.");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật lịch sử vai trò", description = "Cập nhật thông tin lịch sử vai trò")
    @PutMapping("/{roleHistoryId}")
    public ResponseEntity<?> updateRoleHistory(
            @Parameter(description = "ID lịch sử vai trò", required = true) @PathVariable int roleHistoryId,
            @RequestBody RoleHistoryUpdateRequest request) {
        try {
            RoleHistoryDTO roleHistory = roleHistoryService.updateRoleHistory(roleHistoryId, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(roleHistory);
            responseData.setDesc("Role history updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Deactivate lịch sử vai trò", description = "Deactivate một vai trò (set isActive = false, endDate = now)")
    @PutMapping("/{roleHistoryId}/deactivate")
    public ResponseEntity<?> deactivateRoleHistory(
            @Parameter(description = "ID lịch sử vai trò", required = true) @PathVariable int roleHistoryId) {
        try {
            RoleHistoryDTO roleHistory = roleHistoryService.deactivateRoleHistory(roleHistoryId);
            ResponseData responseData = new ResponseData();
            responseData.setData(roleHistory);
            responseData.setDesc("Role history deactivated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Xóa lịch sử vai trò", description = "Xóa lịch sử vai trò khỏi hệ thống")
    @DeleteMapping("/{roleHistoryId}")
    public ResponseEntity<?> deleteRoleHistory(
            @Parameter(description = "ID lịch sử vai trò", required = true) @PathVariable int roleHistoryId) {
        try {
            roleHistoryService.deleteRoleHistory(roleHistoryId);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Role history deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
