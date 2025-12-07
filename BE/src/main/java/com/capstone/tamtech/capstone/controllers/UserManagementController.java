package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.UserManagementDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.UserCreateRequest;
import com.capstone.tamtech.capstone.payload.request.UserSearchRequest;
import com.capstone.tamtech.capstone.payload.request.UserUpdateRequest;
import com.capstone.tamtech.capstone.services.impl.UserManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
@Tag(name = "User Management", description = "API quản lý người dùng (Chỉ dành cho ADMIN)")
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    @Operation(summary = "Lấy danh sách tất cả người dùng (có phân trang)", description = "Trả về danh sách tất cả người dùng trong hệ thống với phân trang")
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "branchId", required = false) Integer branchId,
            @RequestParam(value = "status", required = false) Boolean status,
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size,
            @RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDirection", required = false, defaultValue = "ASC") String sortDirection) {
        try {
            UserSearchRequest searchRequest = new UserSearchRequest();
            searchRequest.setKeyword(keyword);
            searchRequest.setRole(role);
            searchRequest.setBranchId(branchId);
            searchRequest.setStatus(status);
            searchRequest.setPage(page);
            searchRequest.setSize(size);
            searchRequest.setSortBy(sortBy);
            searchRequest.setSortDirection(sortDirection);

            PagedResponse<UserManagementDTO> pagedResponse = userManagementService.getAllUsers(searchRequest);
            ResponseData responseData = new ResponseData();
            responseData.setData(pagedResponse);
            responseData.setDesc("Retrieved " + pagedResponse.getContent().size() + " user(s) from page "
                    + (pagedResponse.getPageNumber() + 1));
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy thông tin người dùng theo ID")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(
            @Parameter(description = "ID người dùng", required = true) @PathVariable int userId) {
        try {
            UserManagementDTO user = userManagementService.getUserById(userId);
            ResponseData responseData = new ResponseData();
            responseData.setData(user);
            responseData.setDesc("User retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo người dùng mới", description = "Tạo người dùng mới trong hệ thống")
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequest request) {
        try {
            UserManagementDTO user = userManagementService.createUser(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(user);
            responseData.setDesc("User created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật thông tin người dùng", description = "Cập nhật thông tin người dùng. Password chỉ update nếu có trong request.")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @Parameter(description = "ID người dùng", required = true) @PathVariable int userId,
            @RequestBody UserUpdateRequest request) {
        try {
            UserManagementDTO user = userManagementService.updateUser(userId, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(user);
            responseData.setDesc("User updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Xóa người dùng", description = "Xóa người dùng khỏi hệ thống")
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(
            @Parameter(description = "ID người dùng", required = true) @PathVariable int userId) {
        try {
            userManagementService.deleteUser(userId);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("User deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cấm người dùng", description = "Cấm người dùng (set isBan = true)")
    @PutMapping("/{userId}/ban")
    public ResponseEntity<?> banUser(
            @Parameter(description = "ID người dùng", required = true) @PathVariable int userId) {
        try {
            UserManagementDTO user = userManagementService.banUser(userId);
            ResponseData responseData = new ResponseData();
            responseData.setData(user);
            responseData.setDesc("User banned successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Bỏ cấm người dùng", description = "Bỏ cấm người dùng (set isBan = false)")
    @PutMapping("/{userId}/unban")
    public ResponseEntity<?> unbanUser(
            @Parameter(description = "ID người dùng", required = true) @PathVariable int userId) {
        try {
            UserManagementDTO user = userManagementService.unbanUser(userId);
            ResponseData responseData = new ResponseData();
            responseData.setData(user);
            responseData.setDesc("User unbanned successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Thống kê người dùng", description = "Thống kê số người dùng hoạt động và không hoạt động. Có thể filter theo branchId.")
    @GetMapping("/statistics")
    public ResponseEntity<?> getUserStatistics(
            @Parameter(description = "ID chi nhánh (optional, nếu không truyền thì lấy tất cả)", required = false) @RequestParam(value = "branchId", required = false) Integer branchId) {
        try {
            ResponseData responseData = new ResponseData();
            responseData.setData(userManagementService.getUserStatistics(branchId));
            responseData.setDesc("User statistics retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
