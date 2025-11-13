package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePromotionRequest {
    private String name;
    private String description;
    private int value;
    private double minimumOrderValue;
    private String startDate;
    private String endDate;
    private boolean status;
    private int promotionTypeId;
}
