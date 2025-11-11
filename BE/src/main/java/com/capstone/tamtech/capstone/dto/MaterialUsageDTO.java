package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialUsageDTO {

    private Integer materialId;

    private String materialName;

    private Double totalQuantityUsed;

    private String unit;

    private Integer totalOrders;

    private String message;
}
