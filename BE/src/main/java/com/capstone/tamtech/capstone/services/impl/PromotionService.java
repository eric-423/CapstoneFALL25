package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.PromotionValidationResult;
import com.capstone.tamtech.capstone.entities.Promotion;
import com.capstone.tamtech.capstone.entities.UserPromotion;

import java.util.UUID;

public interface PromotionService {

    PromotionValidationResult validateAndApplyPromotion(
            int userId,
            String promotionCode,
            double orderSubTotal);

    void markPromotionAsUsed(int userId, UUID promotionId);

    void rollbackPromotionUsage(int userId, UUID promotionId);
}
