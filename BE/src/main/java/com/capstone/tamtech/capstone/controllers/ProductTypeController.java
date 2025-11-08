package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.ProductTypeDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.services.impl.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/product-types")
@RestController
public class ProductTypeController {

    @Autowired
    private ProductTypeService productTypeService;

    @GetMapping
    public ResponseEntity<?> getProductTypes() {
        ResponseData responseData = new ResponseData();
        responseData.setData(productTypeService.getAllProductTypes());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProductType(@RequestBody ProductTypeDTO productTypeDTO) {
        ResponseData responseData = new ResponseData();
        responseData.setData(productTypeService.createProductType(productTypeDTO));
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProductType(@PathVariable int id, @RequestBody ProductTypeDTO productTypeDTO) {
        ResponseData responseData = new ResponseData();
        responseData.setData(productTypeService.updateProductType(id, productTypeDTO));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductTypeById(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        responseData.setData(productTypeService.getProductTypeById(id));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}
