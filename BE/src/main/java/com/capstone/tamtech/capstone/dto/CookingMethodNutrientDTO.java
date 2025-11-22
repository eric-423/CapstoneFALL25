package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CookingMethodNutrientDTO {
    private int cookingMethodId;
    private String cookingMethodName;
    private int nutrientId;
    private String nutrientName;
    private Double retentionFactor;
}
