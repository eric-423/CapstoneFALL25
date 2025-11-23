package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRecipesRequest {
    private int productId;
    private int materialId;
    private int cookingMethodId;
    private double quantity;
    private Integer orderStep;
}
