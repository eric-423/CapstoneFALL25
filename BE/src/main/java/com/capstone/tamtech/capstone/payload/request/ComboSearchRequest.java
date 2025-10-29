package com.capstone.tamtech.capstone.payload.request;

import lombok.Data;

@Data
public class ComboSearchRequest {

    private Integer branchId;

    private String keyword;

    private String productName;

    private Boolean isActive;

    private Double minPrice;

    private Double maxPrice;

    private Integer page;

    private Integer size;

    private String sortBy;

    private String sortDirection;
}


