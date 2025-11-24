package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MaterialNutrientRequest {
    private String state;
    private Double amountPer100Unit;
    private Integer nutrientId;
}
