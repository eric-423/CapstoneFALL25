package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCountStatisticsDTO {

    private Date date;

    private Integer branchId;

    private String branchName;

    private Integer totalOrders;

    private Integer shippingOrders;

    private Integer pickupOrders;

    private Integer diningOrders;

    private String message;
}
