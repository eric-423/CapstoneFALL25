package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.NutrientDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.NutrientRequest;
import com.capstone.tamtech.capstone.payload.request.NutrientsSearchRequest;
import com.capstone.tamtech.capstone.services.impl.NutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nutrients")
public class NutrientController {

    @Autowired
    private NutrientService nutrientService;

    @GetMapping
    public ResponseEntity<?> getAllNutrients(@RequestParam (value = "keyword", defaultValue = "") String keyword,
                                           @RequestParam(value = "unit", defaultValue = "") String unit,
                                           @RequestParam(value = "page", defaultValue = "0") Integer page,
                                           @RequestParam(value = "size", defaultValue = "10") Integer size,
                                           @RequestParam(value = "sortDirection", defaultValue = "ASC") String sortDirection) {

        NutrientsSearchRequest nutrientsSearchRequest = new NutrientsSearchRequest();
        nutrientsSearchRequest.setKeyword(keyword);
        nutrientsSearchRequest.setUnit(unit);
        nutrientsSearchRequest.setPage(page);
        nutrientsSearchRequest.setSize(size);
        nutrientsSearchRequest.setSortDirection(sortDirection);

        PagedResponse<NutrientDTO> pagedResponse = nutrientService.getAllNutrients(nutrientsSearchRequest);
        return new ResponseEntity<>(pagedResponse, HttpStatus.OK);
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
