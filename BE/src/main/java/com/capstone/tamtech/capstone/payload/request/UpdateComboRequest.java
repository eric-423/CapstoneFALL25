package com.capstone.tamtech.capstone.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateComboRequest {
    private String name;
    private String description;
    private Double price;
    private Date startDate;
    private Date endDate;
    private Boolean isActive;
    private Integer branchId;
    private List<ComboItemRequest> comboItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComboItemRequest {
        private Integer productId;
        private Integer quantity;
        private String note;
    }
}
