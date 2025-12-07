package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.CookingMethodDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.CookingMethodRequest;
import com.capstone.tamtech.capstone.payload.request.CookingMethodSearchRequest;
import com.capstone.tamtech.capstone.services.impl.CookingMehodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cooking-methods")
public class CookingMethodController {

    @Autowired
    private CookingMehodService cookingMethodService;

    @GetMapping
    public ResponseEntity<?> getAllCookingMethods(@RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "ASC") String sortDirection) {
        CookingMethodSearchRequest cookingMethodSearchRequest = new CookingMethodSearchRequest();
        cookingMethodSearchRequest.setKeyword(keyword);
        cookingMethodSearchRequest.setPage(page);
        cookingMethodSearchRequest.setSize(size);
        cookingMethodSearchRequest.setSortDirection(sortDirection);

        PagedResponse<CookingMethodDTO> pagedResponse = cookingMethodService
                .getAllCookingMethods(cookingMethodSearchRequest);

        return new ResponseEntity<>(pagedResponse, HttpStatus.OK);
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
