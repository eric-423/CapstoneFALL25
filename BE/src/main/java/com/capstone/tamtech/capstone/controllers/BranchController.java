package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.BranchDistanceDTO;
import com.capstone.tamtech.capstone.services.impl.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
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
}


