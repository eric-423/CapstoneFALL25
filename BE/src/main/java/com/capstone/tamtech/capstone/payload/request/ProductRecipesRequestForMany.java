package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductRecipesRequestForMany {
    private int materialId;
    private int cookingMethodId;
    private double quantity;
    private Integer orderStep;
}
