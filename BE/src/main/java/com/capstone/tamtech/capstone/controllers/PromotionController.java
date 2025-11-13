package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.PromotionDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.AssignPromotionRequest;
import com.capstone.tamtech.capstone.payload.request.CreatePromotionRequest;
import com.capstone.tamtech.capstone.services.impl.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @PostMapping("/create")
    public ResponseEntity<?> createPromotion(
            @RequestBody CreatePromotionRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            PromotionDTO promotion = promotionService.createPromotion(request, email);

            ResponseData responseData = new ResponseData();
            responseData.setData(promotion);
            responseData.setDesc("Promotion created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignPromotionToUsers(@RequestBody AssignPromotionRequest request) {
        try {
            int assignedCount = promotionService.assignPromotionToUsers(request);

            ResponseData responseData = new ResponseData();
            responseData.setData(assignedCount);
            responseData.setDesc("Assigned promotion to " + assignedCount + " users successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/customer/my-promotions")
    public ResponseEntity<?> getMyPromotions(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<PromotionDTO> promotions = promotionService.getCustomerPromotions(email);

            ResponseData responseData = new ResponseData();
            responseData.setData(promotions);
            responseData.setDesc("Retrieved customer promotions successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/customer/available")
    public ResponseEntity<?> getAvailablePromotions(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<PromotionDTO> promotions = promotionService.getAvailablePromotions(email);

            ResponseData responseData = new ResponseData();
            responseData.setData(promotions);
            responseData.setDesc("Retrieved available promotions successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllPromotions() {
        try {
            List<PromotionDTO> promotions = promotionService.getAllPromotions();

            ResponseData responseData = new ResponseData();
            responseData.setData(promotions);
            responseData.setDesc("Retrieved all promotions successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{promotionCode}")
    public ResponseEntity<?> getPromotionByCode(@PathVariable String promotionCode) {
        try {
            PromotionDTO promotion = promotionService.getPromotionByCode(promotionCode);

            ResponseData responseData = new ResponseData();
            responseData.setData(promotion);
            responseData.setDesc("Retrieved promotion successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{promotionCode}/status")
    public ResponseEntity<?> updatePromotionStatus(
            @PathVariable String promotionCode,
            @RequestParam boolean status) {
        try {
            promotionService.updatePromotionStatus(promotionCode, status);

            ResponseData responseData = new ResponseData();
            responseData.setDesc("Promotion status updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/customer/validate/{promotionCode}")
    public ResponseEntity<?> validatePromotion(
            @PathVariable String promotionCode,
            @RequestParam double orderValue,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            boolean isValid = promotionService.validatePromotionForCustomer(email, promotionCode, orderValue);

            ResponseData responseData = new ResponseData();
            responseData.setData(isValid);
            responseData.setDesc(isValid ? "Promotion is valid" : "Promotion is not valid");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
