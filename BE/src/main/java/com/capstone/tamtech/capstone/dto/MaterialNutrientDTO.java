package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MaterialNutrientDTO {
    private int materialId;
    private String materialName;
    private int nutrientId;
    private String nutrientName;
    private Double amountPer100Unit;
}
