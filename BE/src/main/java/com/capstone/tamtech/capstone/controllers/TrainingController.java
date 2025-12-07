package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.TrainingDTO;
import com.capstone.tamtech.capstone.dto.UserManagementDTO;
import com.capstone.tamtech.capstone.dto.UserTrainingDTO;
import com.capstone.tamtech.capstone.dto.UserTrainingDetailDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.TrainingRequest;
import com.capstone.tamtech.capstone.payload.request.TrainingSearchRequest;
import com.capstone.tamtech.capstone.payload.request.TrainingStatusUpdateRequest;
import com.capstone.tamtech.capstone.services.impl.TrainingService;
import com.capstone.tamtech.capstone.services.impl.UserTrainingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trainings")
@CrossOrigin(origins = "*")
@Tag(name = "Training Management", description = "API quản lý đào tạo")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    @Autowired
    private UserTrainingService userTrainingService;

    @Operation(summary = "Lấy danh sách training (admin)")
    @GetMapping("/admin")
    public ResponseEntity<?> getTrainingsAdmin(@ModelAttribute TrainingSearchRequest searchRequest) {
        try {
            if (searchRequest == null) {
                searchRequest = new TrainingSearchRequest();
            }
            PagedResponse<TrainingDTO> pagedResponse = trainingService.getAllTrainings(searchRequest);
            ResponseData responseData = new ResponseData();
            responseData.setData(pagedResponse);
            responseData.setDesc("Retrieved " + pagedResponse.getContent().size() + " training(s) from page "
                    + (pagedResponse.getPageNumber() + 1));
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Chi tiết training (admin)")
    @GetMapping("/admin/{trainingId}")
    public ResponseEntity<?> getTrainingDetailAdmin(@PathVariable int trainingId) {
        try {
            TrainingDTO dto = trainingService.getTrainingById(trainingId);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Training retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo training (admin)")
    @PostMapping("/admin")
    public ResponseEntity<?> createTrainingAdmin(@RequestBody TrainingRequest request) {
        try {
            TrainingDTO dto = trainingService.createTraining(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Training created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật training (admin)")
    @PutMapping("/admin/{trainingId}")
    public ResponseEntity<?> updateTrainingAdmin(@PathVariable int trainingId, @RequestBody TrainingRequest request) {
        try {
            TrainingDTO dto = trainingService.updateTraining(trainingId, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(dto);
            responseData.setDesc("Training updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật trạng thái training (admin)")
    @PatchMapping("/admin/{trainingId}/status")
    public ResponseEntity<?> updateTrainingStatus(
            @PathVariable int trainingId,
            @RequestBody TrainingStatusUpdateRequest request) {
        ResponseData responseData = new ResponseData();
        try {
            if (request == null || request.getIsActive() == null) {
                throw new IllegalArgumentException("isActive is required");
            }
            TrainingDTO dto = trainingService.updateTrainingStatus(trainingId, request.getIsActive());
            responseData.setData(dto);
            responseData.setDesc("Training status updated successfully");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
    }

    @Operation(summary = "Xóa training (admin)")
    @DeleteMapping("/admin/{trainingId}")
    public ResponseEntity<?> deleteTrainingAdmin(@PathVariable int trainingId) {
        try {
            trainingService.deleteTraining(trainingId);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Training deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Danh sách training của người dùng hiện tại")
    @GetMapping("/me")
    public ResponseEntity<?> getMyTrainings(@RequestParam(value = "status", required = false) String status) {
        ResponseData responseData = new ResponseData();
        List<UserTrainingDTO> trainings = userTrainingService.getMyTrainings(status);
        responseData.setData(trainings);
        responseData.setDesc("Retrieved " + trainings.size() + " training(s)");
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Chi tiết training của người dùng hiện tại")
    @GetMapping("/me/{userTrainingId}")
    public ResponseEntity<?> getMyTrainingDetail(@PathVariable int userTrainingId) {
        ResponseData responseData = new ResponseData();
        UserTrainingDetailDTO detail = userTrainingService.getMyTrainingDetail(userTrainingId);
        responseData.setData(detail);
        responseData.setDesc("Training detail retrieved");
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Tự enroll vào training")
    @PostMapping("/me/{trainingId}/enroll")
    public ResponseEntity<?> enrollTraining(@PathVariable int trainingId) {
        ResponseData responseData = new ResponseData();
        try {
            responseData.setData(userTrainingService.enrollCurrentUser(trainingId));
            responseData.setDesc("Enrolled successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
    }

    @Operation(summary = "Lấy danh sách người dùng hợp lệ để assign vào training (admin)")
    @GetMapping("/admin/{trainingId}/available-users")
    public ResponseEntity<?> getAvailableUsersForTraining(
            @PathVariable int trainingId,
            @RequestParam(value = "branchId", required = false) Integer branchId) {
        ResponseData responseData = new ResponseData();
        try {
            List<UserManagementDTO> users = userTrainingService.getAvailableUsersForTraining(trainingId, branchId);
            responseData.setData(users);
            responseData.setDesc("Retrieved " + users.size() + " available user(s) for training");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
    }
}
