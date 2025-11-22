package com.capstone.tamtech.capstone.dto;

import com.capstone.tamtech.capstone.entities.Promotion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionValidationResult {
    private boolean valid;
    private String errorMessage;
    private Promotion promotion;
    private int discountPercent;
    private double discountValue;
    private boolean isFreeShipping;

    public static PromotionValidationResult invalid(String errorMessage) {
        PromotionValidationResult result = new PromotionValidationResult();
        result.setValid(false);
        result.setErrorMessage(errorMessage);
        result.setDiscountPercent(0);
        result.setDiscountValue(0.0);
        result.setFreeShipping(false);
        return result;
    }

    public static PromotionValidationResult success(
            Promotion promotion,
            int discountPercent,
            double discountValue,
            boolean isFreeShipping) {
        PromotionValidationResult result = new PromotionValidationResult();
        result.setValid(true);
        result.setPromotion(promotion);
        result.setDiscountPercent(discountPercent);
        result.setDiscountValue(discountValue);
        result.setFreeShipping(isFreeShipping);
        return result;
    }
}
