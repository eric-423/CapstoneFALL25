package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.ShiftDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.ShiftRequest;
import com.capstone.tamtech.capstone.services.impl.ShiftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@CrossOrigin(origins = "*")
@Tag(name = "Shift Management", description = "API quản lý ca làm việc")
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @Operation(summary = "Lấy danh sách ca làm việc", description = "Có thể lọc theo branchId")
    @GetMapping
    public ResponseEntity<?> getAllShifts(
            @Parameter(description = "ID chi nhánh (optional)") @RequestParam(required = false) Integer branchId) {
        try {
            List<ShiftDTO> shifts = shiftService.getAllShifts(branchId);
            ResponseData responseData = new ResponseData();
            responseData.setData(shifts);
            responseData.setDesc("Retrieved " + shifts.size() + " shift(s) successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy thông tin ca theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getShiftById(
            @Parameter(description = "ID ca làm việc", required = true) @PathVariable int id) {
        try {
            ShiftDTO shift = shiftService.getShiftById(id);
            ResponseData responseData = new ResponseData();
            responseData.setData(shift);
            responseData.setDesc("Shift retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo ca làm việc mới")
    @PostMapping
    public ResponseEntity<?> createShift(@RequestBody ShiftRequest request) {
        try {
            ShiftDTO shift = shiftService.createShift(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(shift);
            responseData.setDesc("Shift created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật ca làm việc")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShift(
            @Parameter(description = "ID ca làm việc", required = true) @PathVariable int id,
            @RequestBody ShiftRequest request) {
        try {
            ShiftDTO shift = shiftService.updateShift(id, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(shift);
            responseData.setDesc("Shift updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}


