package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO implements Serializable {
    private int id;
    private String name;
    private double quantity;
    private Double caloriesPerUnit;
    private String unit;
    private Double threshold;
    private Integer materialTypeId;
    private String materialTypeName;
    private Boolean isDeleted;
}
