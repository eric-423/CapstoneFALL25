package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.TrainingDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.TrainingRequest;
import com.capstone.tamtech.capstone.payload.request.TrainingSearchRequest;
import com.capstone.tamtech.capstone.services.impl.TrainingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainings")
@CrossOrigin(origins = "*")
@Tag(name = "Training Management", description = "API quản lý đào tạo")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    @Operation(summary = "Lấy danh sách training (có phân trang)", description = "Trả về danh sách training với phân trang. Set includeInactive=true để lấy cả những training không active.")
    @GetMapping
    public ResponseEntity<?> getTrainings(TrainingSearchRequest searchRequest) {
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

    @Operation(summary = "Lấy training theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getTrainingById(
            @Parameter(description = "ID training", required = true) @PathVariable int id) {
        try {
            TrainingDTO dto = trainingService.getTrainingById(id);
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

    @Operation(summary = "Tạo training mới")
    @PostMapping
    public ResponseEntity<?> createTraining(@RequestBody TrainingRequest request) {
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

    @Operation(summary = "Cập nhật training")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTraining(
            @Parameter(description = "ID training", required = true) @PathVariable int id,
            @RequestBody TrainingRequest request) {
        try {
            TrainingDTO dto = trainingService.updateTraining(id, request);
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

    @Operation(summary = "Xóa training", description = "Xóa training. Không xóa được nếu đang được sử dụng bởi users.")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTraining(
            @Parameter(description = "ID training", required = true) @PathVariable int id) {
        try {
            trainingService.deleteTraining(id);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Training deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
