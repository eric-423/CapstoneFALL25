package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRecipesDTO implements Serializable {
    private int id;
    private int productId;
    private String productName;
    private int materialId;
    private String materialName;
    private int cookingMethodId;
    private String cookingMethodName;
    private double quantity;
    private Integer orderStep;
    private Date createdAt;
    private String unit;
}
