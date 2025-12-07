package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.services.impl.PromotionTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/promotion-types")
public class PromotionTypeController {


    @Autowired
    private PromotionTypeService promotionTypeService;

    @GetMapping
    public ResponseEntity<?> getAllPromotionTypes() {

        return ResponseEntity.ok(promotionTypeService.getAllPromotionTypes());
    }
}
