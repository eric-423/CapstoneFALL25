package com.capstone.tamtech.capstone.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Data
public class PromotionDTO implements Serializable {
    private UUID id;

    private String name;

    private String description;

    private int value;

    private double minimumOrderValue;

    private String startDate;

    private String endDate;

    private boolean status;

    private String promotionType;

    private Date createdAt;
}
