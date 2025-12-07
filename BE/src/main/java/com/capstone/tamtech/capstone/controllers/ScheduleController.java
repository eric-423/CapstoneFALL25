package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.ScheduleDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.ScheduleRequest;
import com.capstone.tamtech.capstone.services.impl.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<?> getAllSchedules(@RequestParam(required = false) Integer branchId) {
        ResponseData responseData = new ResponseData();
        List<ScheduleDTO> schedules = scheduleService.getAllSchedules(branchId);
        responseData.setData(schedules);
        responseData.setStatus(200);
        responseData.setDesc("Retrieved " + schedules.size() + " schedule(s) successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getScheduleById(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        responseData.setData(scheduleService.getScheduleById(id));
        responseData.setStatus(200);
        responseData.setDesc("Schedule retrieved successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getSchedulesByUserId(@PathVariable int userId) {
        ResponseData responseData = new ResponseData();
        List<ScheduleDTO> schedules = scheduleService.getSchedulesByUserId(userId);
        responseData.setData(schedules);
        responseData.setStatus(200);
        responseData.setDesc("Retrieved " + schedules.size() + " schedule(s) for user successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody ScheduleRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(scheduleService.createSchedule(request));
        responseData.setStatus(201);
        responseData.setDesc("Schedule created successfully");
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importSchedules(@RequestParam("file") MultipartFile file) {
        List<ScheduleDTO> schedules = scheduleService.importSchedules(file);
        ResponseData responseData = new ResponseData();
        responseData.setStatus(200);
        responseData.setData(schedules);
        responseData.setDesc("Imported " + schedules.size() + " schedule(s) successfully");
        return ResponseEntity.ok(responseData);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable int id, @RequestBody ScheduleRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(scheduleService.updateSchedule(id, request));
        responseData.setStatus(200);
        responseData.setDesc("Schedule updated successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        scheduleService.deleteSchedule(id);
        responseData.setStatus(200);
        responseData.setDesc("Schedule deleted successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
