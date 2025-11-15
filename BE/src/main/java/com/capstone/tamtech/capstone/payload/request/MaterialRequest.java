package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialRequest {
    private String name;
    private Double caloriesPerUnit;
    private String unit;
    private Double threshold;
    private Integer materialTypeId;
}
