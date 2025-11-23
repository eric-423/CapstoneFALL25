package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.NutrientDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.NutrientRequest;
import com.capstone.tamtech.capstone.services.impl.NutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nutrients")
public class NutrientController {

    @Autowired
    private NutrientService nutrientService;

    @GetMapping
    public ResponseEntity<?> getAllNutrients() {
        ResponseData responseData = new ResponseData();
        List<NutrientDTO> nutrients = nutrientService.getAllNutrients();
        responseData.setData(nutrients);
        responseData.setStatus(200);
        responseData.setDesc("Retrieved " + nutrients.size() + " nutrient(s) successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNutrientById(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        responseData.setData(nutrientService.getNutrientById(id));
        responseData.setStatus(200);
        responseData.setDesc("Nutrient retrieved successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createNutrient(@RequestBody NutrientRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(nutrientService.createNutrient(request));
        responseData.setStatus(201);
        responseData.setDesc("Nutrient created successfully");
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNutrient(@PathVariable int id, @RequestBody NutrientRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(nutrientService.updateNutrient(id, request));
        responseData.setStatus(200);
        responseData.setDesc("Nutrient updated successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNutrient(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        nutrientService.deleteNutrient(id);
        responseData.setStatus(200);
        responseData.setDesc("Nutrient deleted successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
