package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStatsDTO {
    private int productId;
    private String productName;
    private long quantitySold;
    private double totalRevenue;
    private String image;
}

