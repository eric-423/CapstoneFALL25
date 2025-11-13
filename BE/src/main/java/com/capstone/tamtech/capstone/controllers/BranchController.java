package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.BranchDTO;
import com.capstone.tamtech.capstone.dto.BranchDistanceDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.BranchRequest;
import com.capstone.tamtech.capstone.services.impl.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*")
@Tag(name = "Branch Management", description = "API quản lý chi nhánh")
public class BranchController {

    @Autowired
    private BranchService branchService;

    @Operation(summary = "Danh sách chi nhánh theo khoảng cách",
            description = "Trả về danh sách chi nhánh sắp xếp từ gần tới xa theo địa chỉ người dùng, kèm khoảng cách.")
    @GetMapping("/nearby")
    public ResponseEntity<List<BranchDistanceDTO>> getBranchesNearby(
            @Parameter(description = "Địa chỉ của người dùng (bắt buộc)", required = true)
            @RequestParam(name = "address") String userAddress,

            @Parameter(description = "Giới hạn số lượng kết quả", example = "5")
            @RequestParam(name = "limit", required = false) Integer limit
    ) {
        List<BranchDistanceDTO> results = branchService.findBranchesSortedByDistance(userAddress, limit);
        return ResponseEntity.ok(results);
    }

    @GetMapping()
    public ResponseEntity<List<BranchDTO>> getAllBranches() {
        List<BranchDTO> results = branchService.getAllBranches();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{branchId}")
    public ResponseEntity<BranchDTO> getBranchById(@PathVariable int branchId) {
        BranchDTO branchDTO = branchService.getBranchById(branchId);
        return ResponseEntity.ok(branchDTO);
    }

    @PutMapping("/{branchId}/deactivate")
    public ResponseEntity<?> deactivateBranch(@PathVariable int branchId) throws BadRequestException {
        Boolean result = branchService.deactivateBranch(branchId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{branchId}/activate")
    public ResponseEntity<?> activateBranch(@PathVariable int branchId) throws BadRequestException {
        Boolean result = branchService.activateBranch(branchId);
        return ResponseEntity.ok(result);
    }

    @PostMapping()
    public ResponseEntity<?> createBranch(@RequestBody BranchRequest branchRequest) {
        BranchDTO createdBranch = branchService.createBranch(branchRequest);
        ResponseData responseData = new ResponseData();
        responseData.setData(createdBranch);
        responseData.setDesc("Branch created successfully");
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/{branchId}")
    public ResponseEntity<BranchDTO> updateBranch(@PathVariable int branchId, @RequestBody BranchRequest branchRequest) {
        BranchDTO updatedBranch = branchService.updateBranch(branchId, branchRequest);
        return ResponseEntity.ok(updatedBranch);
    }

    @PutMapping("/add-product/{branchId}")
    public ResponseEntity<?> addProductToBranch(@PathVariable int branchId, @RequestBody BranchDistanceDTO branchDTO) {
//        BranchDistanceDTO updatedBranch = branchService.addBranchProduct(branchId, branchDTO);
        return ResponseEntity.ok(null);
    }
}


