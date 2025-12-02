package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionEffectivenessDTO {
    private String code;
    private Long usageCount;
    private Double revenueGenerated;
}

