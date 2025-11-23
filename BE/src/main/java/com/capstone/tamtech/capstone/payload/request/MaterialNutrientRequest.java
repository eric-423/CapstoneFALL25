package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MaterialNutrientRequest {
    private int materialId;
    private int nutrientId;
    private String state;
    private Double amountPer100Unit;
}
