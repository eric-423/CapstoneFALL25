package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.CookingMethodNutrientDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.CookingMethodNutrientRequest;
import com.capstone.tamtech.capstone.services.impl.CookingMethodNutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cooking-method-nutrients")
public class CookingMethodNutrientController {

    @Autowired
    private CookingMethodNutrientService cookingMethodNutrientService;

    @GetMapping
    public ResponseEntity<?> getAllCookingMethodNutrients() {
        ResponseData responseData = new ResponseData();
        List<CookingMethodNutrientDTO> cookingMethodNutrients = cookingMethodNutrientService
                .getAllCookingMethodNutrients();
        responseData.setData(cookingMethodNutrients);
        responseData.setStatus(200);
        responseData.setDesc("Retrieved " + cookingMethodNutrients.size() + " cooking method nutrient(s) successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{cookingMethodId}/{nutrientId}")
    public ResponseEntity<?> getCookingMethodNutrientById(
            @PathVariable int cookingMethodId,
            @PathVariable int nutrientId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(cookingMethodNutrientService.getCookingMethodNutrientById(cookingMethodId, nutrientId));
        responseData.setStatus(200);
        responseData.setDesc("Cooking method nutrient retrieved successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createCookingMethodNutrient(@RequestBody CookingMethodNutrientRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(cookingMethodNutrientService.createCookingMethodNutrient(request));
        responseData.setStatus(201);
        responseData.setDesc("Cooking method nutrient created successfully");
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/{cookingMethodId}/{nutrientId}")
    public ResponseEntity<?> updateCookingMethodNutrient(
            @PathVariable int cookingMethodId,
            @PathVariable int nutrientId,
            @RequestBody CookingMethodNutrientRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(
                cookingMethodNutrientService.updateCookingMethodNutrient(cookingMethodId, nutrientId, request));
        responseData.setStatus(200);
        responseData.setDesc("Cooking method nutrient updated successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/{cookingMethodId}/{nutrientId}")
    public ResponseEntity<?> deleteCookingMethodNutrient(
            @PathVariable int cookingMethodId,
            @PathVariable int nutrientId) {
        ResponseData responseData = new ResponseData();
        cookingMethodNutrientService.deleteCookingMethodNutrient(cookingMethodId, nutrientId);
        responseData.setStatus(200);
        responseData.setDesc("Cooking method nutrient deleted successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
