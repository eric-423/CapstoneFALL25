package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRecipesDTO implements Serializable {
    private int productId;
    private String productName;
    private int materialId;
    private String materialName;
    private double quantity;
}
