package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingProductDTO {
    private Integer productId;
    private String productName;
    private Long quantitySold;
    private Double totalRevenue;
    private String image;
}

