package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.UnitDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.UnitRequest;
import com.capstone.tamtech.capstone.services.impl.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    @Autowired
    private UnitService unitService;

    @GetMapping
    public ResponseEntity<?> getAllUnits() {
        ResponseData responseData = new ResponseData();
        List<UnitDTO> units = unitService.getAllUnits();
        responseData.setData(units);
        responseData.setStatus(200);
        responseData.setDesc("Retrieved " + units.size() + " unit(s) successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUnitById(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        responseData.setData(unitService.getUnitById(id));
        responseData.setStatus(200);
        responseData.setDesc("Unit retrieved successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createUnit(@RequestBody UnitRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(unitService.createUnit(request));
        responseData.setStatus(201);
        responseData.setDesc("Unit created successfully");
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUnit(@PathVariable int id, @RequestBody UnitRequest request) {
        ResponseData responseData = new ResponseData();
        responseData.setData(unitService.updateUnit(id, request));
        responseData.setStatus(200);
        responseData.setDesc("Unit updated successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUnit(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        unitService.deleteUnit(id);
        responseData.setStatus(200);
        responseData.setDesc("Unit deleted successfully");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
