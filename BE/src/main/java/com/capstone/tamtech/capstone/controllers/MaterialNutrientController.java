package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.MaterialNutrientDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.MaterialNutrientCreateRequest;
import com.capstone.tamtech.capstone.payload.request.MaterialNutrientRequest;
import com.capstone.tamtech.capstone.services.impl.MaterialNutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/material-nutrients")
public class MaterialNutrientController {

    @Autowired
    private MaterialNutrientService materialNutrientService;

    @GetMapping
    public ResponseEntity<?> getAllMaterialNutrients(@RequestParam(required = false, defaultValue = "0") Integer materialId, @RequestParam(required = false, defaultValue = "0") Integer nutrientId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "ASC") String sortDirection) {
        PagedResponse<MaterialNutrientDTO> pagedResponse = materialNutrientService.getAllMaterialNutrients(materialId, nutrientId, page, size, sortDirection);

        return new ResponseEntity<>(pagedResponse, HttpStatus.OK);
    }

    @GetMapping("/{materialId}/{nutrientId}")
    public ResponseEntity<?> getMaterialNutrientById(@PathVariable int materialId, @PathVariable int nutrientId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(materialNutrientService.getMaterialNutrientById(materialId, nutrientId));
        responseData.setStatus(200);
        responseData.setDesc("Material nutrient retrieved successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createMaterialNutrient(@RequestBody MaterialNutrientCreateRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(materialNutrientService.createMaterialNutrient(request));
        responseData.setStatus(201);
        responseData.setDesc("Material nutrient created successfully");
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/{materialId}")
    public ResponseEntity<?> updateMaterialNutrient(@PathVariable int materialId, @RequestBody List<MaterialNutrientRequest> request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(materialNutrientService.updateManyMaterialNutrient(materialId, request));
        responseData.setStatus(200);
        responseData.setDesc("Material nutrient updated successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/{materialId}/{nutrientId}")
    public ResponseEntity<?> updateMaterialNutrient(@PathVariable int materialId, @PathVariable int nutrientId, @RequestBody MaterialNutrientRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(materialNutrientService.updateMaterialNutrient(materialId, nutrientId, request));
        responseData.setStatus(200);
        responseData.setDesc("Material nutrient updated successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/{materialId}/{nutrientId}")
    public ResponseEntity<?> deleteMaterialNutrient(@PathVariable int materialId, @PathVariable int nutrientId) {
        ResponseData responseData = new ResponseData();
        materialNutrientService.deleteMaterialNutrient(materialId, nutrientId);
        responseData.setStatus(200);
        responseData.setDesc("Material nutrient deleted successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
