package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchProductDTO {
    private int branchId;
    private String branchName;
    private int productId;
    private String productName;
    private double productPrice;
    private String productImage;
}
