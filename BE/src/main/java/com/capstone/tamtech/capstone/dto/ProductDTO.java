package com.capstone.tamtech.capstone.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ProductDTO implements Serializable {
    private int productId;
    private String productName;
    private String productDescription;
    private String productImage;
    private double productPrice;
    private String productType;
    private int productQuantity;
    private List<RecipeItem> recipe;
    private boolean status;
    private double calories;

    @Data
    public static class RecipeItem implements Serializable {
        private String materialName;
        private double quantity;
    }
}
