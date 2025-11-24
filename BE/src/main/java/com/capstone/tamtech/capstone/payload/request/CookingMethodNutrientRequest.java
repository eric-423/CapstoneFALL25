package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CookingMethodNutrientRequest {
    private int cookingMethodId;
    private int nutrientId;
    private Double retentionFactor;
}
