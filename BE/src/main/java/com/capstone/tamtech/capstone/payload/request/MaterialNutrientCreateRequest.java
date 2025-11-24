package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Data
public class MaterialNutrientCreateRequest {
    private Double amountPer100Unit;
    private int materialId;
    private int nutrientId;
}
