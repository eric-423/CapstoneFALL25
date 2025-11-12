package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.PromotionDTO;
import com.capstone.tamtech.capstone.dto.PromotionValidationResult;
import com.capstone.tamtech.capstone.payload.request.AssignPromotionRequest;
import com.capstone.tamtech.capstone.payload.request.CreatePromotionRequest;

import java.util.List;
import java.util.UUID;

public interface PromotionService {

    PromotionValidationResult validateAndApplyPromotion(
            int userId,
            String promotionCode,
            double orderSubTotal);

    void markPromotionAsUsed(int userId, UUID promotionId);

    void rollbackPromotionUsage(int userId, UUID promotionId);

    PromotionDTO createPromotion(CreatePromotionRequest request, String createdByEmail);

    int assignPromotionToUsers(AssignPromotionRequest request);

    List<PromotionDTO> getCustomerPromotions(String customerEmail);

    List<PromotionDTO> getAvailablePromotions(String customerEmail);

    List<PromotionDTO> getAllPromotions();

    PromotionDTO getPromotionByCode(String promotionCode);

    void updatePromotionStatus(String promotionCode, boolean status);

    boolean validatePromotionForCustomer(String customerEmail, String promotionCode, double orderValue);
}
