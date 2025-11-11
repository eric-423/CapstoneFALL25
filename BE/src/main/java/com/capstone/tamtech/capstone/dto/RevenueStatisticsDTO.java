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
public class RevenueStatisticsDTO {

    private Date date;

    private Integer branchId;

    private String branchName;

    private Double totalRevenue;

    private Integer totalOrders;

    private String message;
}
