package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.DocumentDTO;
import com.capstone.tamtech.capstone.dto.LessonProgressDTO;
import com.capstone.tamtech.capstone.dto.UserTrainingDTO;
import com.capstone.tamtech.capstone.dto.UserTrainingProgressDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.AssignUsersToTrainingRequest;
import com.capstone.tamtech.capstone.payload.request.UserTrainingUpdateRequest;
import com.capstone.tamtech.capstone.services.impl.UserTrainingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-trainings")
@CrossOrigin(origins = "*")
@Tag(name = "User Training Progress - Me")
public class UserTrainingProgressController {

    @Autowired
    private UserTrainingService userTrainingService;

    @PostMapping("/admin/trainings/{trainingId}/assign-users")
    public ResponseEntity<?> assignUsersToTraining(
            @PathVariable int trainingId,
            @RequestBody AssignUsersToTrainingRequest request) {
        ResponseData responseData = new ResponseData();
        try {
            int count = userTrainingService.assignUsersToTraining(trainingId, request);
            responseData.setDesc("Assigned " + count + " user(s) to training");
            return ResponseEntity.status(201).body(responseData);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(responseData);
        }
    }

    @GetMapping("/admin/trainings/{trainingId}/users")
    public ResponseEntity<?> getUsersByTraining(@PathVariable int trainingId) {
        ResponseData responseData = new ResponseData();
        List<UserTrainingDTO> data = userTrainingService.getUserTrainingsByTraining(trainingId);
        responseData.setData(data);
        responseData.setDesc("Retrieved " + data.size() + " user(s) for training");
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/admin/users/{userId}/trainings")
    public ResponseEntity<?> getTrainingsByUser(@PathVariable int userId) {
        ResponseData responseData = new ResponseData();
        List<UserTrainingDTO> data = userTrainingService.getTrainingsByUser(userId);
        responseData.setData(data);
        responseData.setDesc("Retrieved " + data.size() + " training(s) for user");
        return ResponseEntity.ok(responseData);
    }

    @PatchMapping("/admin/user-trainings/{userTrainingId}")
    public ResponseEntity<?> updateUserTraining(
            @PathVariable int userTrainingId,
            @RequestBody UserTrainingUpdateRequest request) {
        ResponseData responseData = new ResponseData();
        try {
            responseData.setData(userTrainingService.updateUserTraining(userTrainingId, request));
            responseData.setDesc("User training updated successfully");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setDesc("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(responseData);
        }
    }

    @GetMapping("/me/{userTrainingId}/progress")
    public ResponseEntity<?> getTrainingProgress(@PathVariable int userTrainingId) {
        ResponseData responseData = new ResponseData();
        UserTrainingProgressDTO progressDTO = userTrainingService.getMyTrainingProgress(userTrainingId);
        responseData.setData(progressDTO);
        responseData.setDesc("Training progress retrieved");
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/me/user-trainings/{userTrainingId}/lessons/{lessonId}")
    public ResponseEntity<?> getLessonDetail(
            @PathVariable int userTrainingId,
            @PathVariable int lessonId) {
        ResponseData responseData = new ResponseData();
        LessonProgressDTO dto = userTrainingService.getMyLessonDetail(userTrainingId, lessonId);
        responseData.setData(dto);
        responseData.setDesc("Lesson detail retrieved");
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/me/user-trainings/{userTrainingId}/lessons/{lessonId}/start")
    public ResponseEntity<?> startLesson(
            @PathVariable int userTrainingId,
            @PathVariable int lessonId) {
        ResponseData responseData = new ResponseData();
        LessonProgressDTO dto = userTrainingService.startLesson(userTrainingId, lessonId);
        responseData.setData(dto);
        responseData.setDesc("Lesson started");
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/me/user-trainings/{userTrainingId}/lessons/{lessonId}/complete")
    public ResponseEntity<?> completeLesson(
            @PathVariable int userTrainingId,
            @PathVariable int lessonId) {
        ResponseData responseData = new ResponseData();
        LessonProgressDTO dto = userTrainingService.completeLesson(userTrainingId, lessonId);
        responseData.setData(dto);
        responseData.setDesc("Lesson completed");
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/me/lessons/{lessonId}/documents")
    public ResponseEntity<?> getLessonDocuments(@PathVariable int lessonId) {
        ResponseData responseData = new ResponseData();
        List<DocumentDTO> documents = userTrainingService.getLessonDocumentsForCurrentUser(lessonId);
        responseData.setData(documents);
        responseData.setDesc("Documents retrieved");
        return ResponseEntity.ok(responseData);
    }
}
