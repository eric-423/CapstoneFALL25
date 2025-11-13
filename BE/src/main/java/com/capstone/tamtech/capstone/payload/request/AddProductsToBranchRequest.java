package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddProductsToBranchRequest {
    private List<ProductItem> products;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductItem {
        private int productId;
        private int quantity;
    }
}
