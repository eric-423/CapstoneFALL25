package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class NutrientDTO {
    private int id;
    private String name;
    private String code;
    private String unit;
    private double energyPerUnit;
}
