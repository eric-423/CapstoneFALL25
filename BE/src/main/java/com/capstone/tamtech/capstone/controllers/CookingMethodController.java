package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.CookingMethodDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.CookingMethodRequest;
import com.capstone.tamtech.capstone.services.impl.CookingMehodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cooking-methods")
public class CookingMethodController {

    @Autowired
    private CookingMehodService cookingMethodService;

    @GetMapping
    public ResponseEntity<?> getAllCookingMethods() {
        ResponseData responseData = new ResponseData();
        List<CookingMethodDTO> cookingMethods = cookingMethodService.getAllCookingMethods();
        responseData.setData(cookingMethods);
        responseData.setStatus(200);
        responseData.setDesc("Retrieved " + cookingMethods.size() + " cooking method(s) successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCookingMethodById(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        responseData.setData(cookingMethodService.getCookingMethodById(id));
        responseData.setStatus(200);
        responseData.setDesc("Cooking method retrieved successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createCookingMethod(@RequestBody CookingMethodRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(cookingMethodService.createCookingMethod(request));
        responseData.setStatus(201);
        responseData.setDesc("Cooking method created successfully");
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCookingMethod(@PathVariable int id, @RequestBody CookingMethodRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(cookingMethodService.updateCookingMethod(id, request));
        responseData.setStatus(200);
        responseData.setDesc("Cooking method updated successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
