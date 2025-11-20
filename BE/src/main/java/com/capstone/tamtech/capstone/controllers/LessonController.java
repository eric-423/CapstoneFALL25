package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.LessonOrderUpdateRequest;
import com.capstone.tamtech.capstone.payload.request.LessonRequest;
import com.capstone.tamtech.capstone.payload.request.LessonSearchRequest;
import com.capstone.tamtech.capstone.services.impl.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/admin/trainings/{trainingId}/lessons")
    public ResponseEntity<?> getLessonsByTrainingId(
            @PathVariable int trainingId,
            @ModelAttribute LessonSearchRequest lessonSearchRequest) {
        ResponseData responseData = new ResponseData();
        if (lessonSearchRequest == null) {
            lessonSearchRequest = new LessonSearchRequest();
        }
        responseData.setData(lessonService.getLessonByTrainingId(trainingId, lessonSearchRequest));
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/admin/lessons/{lessonId}")
    public ResponseEntity<?> getLessonById(@PathVariable int lessonId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(lessonService.getLessonById(lessonId));
        return ResponseEntity.ok(responseData);

    }

    @PostMapping("/admin/trainings/{trainingId}/lessons")
    public ResponseEntity<?> createLesson(@PathVariable int trainingId, @RequestBody LessonRequest lessonRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(lessonService.createLesson(trainingId, lessonRequest));
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/admin/lessons/{lessonId}")
    public ResponseEntity<?> updateLesson(@PathVariable int lessonId, @RequestBody LessonRequest lessonRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(lessonService.updateLesson(lessonId, lessonRequest));

        return ResponseEntity.ok(responseData);
    }

    @PatchMapping("/admin/lessons/{lessonId}/status")
    public ResponseEntity<?> inActiveLesson(@PathVariable int lessonId, @RequestBody boolean isActive) {
        ResponseData responseData = new ResponseData();
        responseData.setData(lessonService.inActiveLesson(lessonId, isActive));
        return ResponseEntity.ok(responseData);
    }

    @PatchMapping("/admin/lessons/{lessonId}/order")
    public ResponseEntity<?> updateLessonOrder(
            @PathVariable int lessonId,
            @RequestBody LessonOrderUpdateRequest request) {
        ResponseData responseData = new ResponseData();
        if (request == null || request.getOrderIndex() == null) {
            responseData.setDesc("orderIndex is required");
            return ResponseEntity.badRequest().body(responseData);
        }
        responseData.setData(lessonService.updateLessonOrder(lessonId, request.getOrderIndex()));
        return ResponseEntity.ok(responseData);
    }

    @PatchMapping("/admin/trainings/{trainingId}/lessons/order")
    public ResponseEntity<?> bulkUpdateLessonOrder(
            @PathVariable int trainingId,
            @RequestBody LessonOrderUpdateRequest request) {
        ResponseData responseData = new ResponseData();
        if (request == null || request.getOrders() == null || request.getOrders().isEmpty()) {
            responseData.setDesc("orders is required");
            return ResponseEntity.badRequest().body(responseData);
        }
        responseData.setData(lessonService.updateLessonOrders(trainingId, request.getOrders()));
        return ResponseEntity.ok(responseData);
    }

}
