package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.AttendanceDTO;
import com.capstone.tamtech.capstone.dto.AttendanceSummaryDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.services.impl.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "*")
@Tag(name = "Attendance Management", description = "API quản lý chấm công")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Operation(summary = "Nhân viên check-in")
    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn() {
        ResponseData responseData = new ResponseData();
        try {
            AttendanceDTO dto = attendanceService.checkIn();
            responseData.setData(dto);
            responseData.setDesc("Check-in thành công");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Nhân viên check-out")
    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut() {
        ResponseData responseData = new ResponseData();
        try {
            AttendanceDTO dto = attendanceService.checkOut();
            responseData.setData(dto);
            responseData.setDesc("Check-out thành công");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy danh sách chấm công (Admin)")
    @GetMapping
    public ResponseEntity<?> getAttendanceList(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "branchId", required = false) Integer branchId,
            @RequestParam(value = "fromDate", required = false) Date fromDate,
            @RequestParam(value = "toDate", required = false) Date toDate) {
        ResponseData responseData = new ResponseData();
        try {
            List<AttendanceDTO> attendances = attendanceService.getAttendanceList(userId, branchId, fromDate, toDate);
            responseData.setData(attendances);
            responseData.setDesc("Retrieved " + attendances.size() + " attendance record(s)");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Lấy tổng hợp chấm công theo tháng")
    @GetMapping("/summary")
    public ResponseEntity<?> getAttendanceSummary(
            @RequestParam(value = "userId", required = true) Integer userId,
            @RequestParam(value = "month", required = true) String month) {
        ResponseData responseData = new ResponseData();
        try {
            String[] parts = month.split("-");
            if (parts.length != 2) {
                throw new IllegalArgumentException("Month format phải là YYYY-MM (ví dụ: 2025-11)");
            }
            Integer year = Integer.parseInt(parts[0]);
            Integer monthValue = Integer.parseInt(parts[1]);

            AttendanceSummaryDTO summary = attendanceService.getAttendanceSummary(userId, year, monthValue);
            responseData.setData(summary);
            responseData.setDesc("Attendance summary retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Kiểm tra nhân viên đã điểm danh trong ngày", description = "Kiểm tra xem nhân viên có điểm danh trong ngày cụ thể hay chưa. "
            +
            "Trả về AttendanceDTO nếu đã điểm danh, null nếu chưa điểm danh.")
    @GetMapping("/check")
    public ResponseEntity<?> checkAttendance(
            @Parameter(description = "ID nhân viên", required = true, example = "1") @RequestParam(value = "userId", required = true) Integer userId,
            @Parameter(description = "Ngày cần kiểm tra (yyyy-MM-dd). Không truyền = hôm nay", example = "2025-01-15") @RequestParam(value = "date", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        ResponseData responseData = new ResponseData();
        try {
            if (date == null) {
                date = new Date(System.currentTimeMillis());
            }

            AttendanceDTO attendance = attendanceService.checkAttendance(userId, date);

            if (attendance != null) {
                responseData.setData(attendance);
                responseData.setDesc("Nhân viên đã điểm danh trong ngày này");
            } else {
                responseData.setData(null);
                responseData.setDesc("Nhân viên chưa điểm danh trong ngày này");
            }

            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
