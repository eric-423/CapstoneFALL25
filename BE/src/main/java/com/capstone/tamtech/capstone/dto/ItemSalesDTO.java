package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemSalesDTO {

    private String type;

    private Integer id;

    private String name;

    private Integer totalQuantitySold;

    private Double totalRevenue;

    private Integer totalOrders;

    private String message;
}
