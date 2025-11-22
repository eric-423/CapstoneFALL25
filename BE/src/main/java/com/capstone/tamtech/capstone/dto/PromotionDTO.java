package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDTO {
    private UUID id;
    private String name;
    private String description;
    private int value;
    private double minimumOrderValue;
    private String startDate;
    private String endDate;
    private boolean status;
    private Date createdAt;
    private String promotionTypeName;
    private String createdByName;

    private Date receivedDate;
    private Date usedDate;
    private String userPromotionStatus;
    private int usageCount;
}
