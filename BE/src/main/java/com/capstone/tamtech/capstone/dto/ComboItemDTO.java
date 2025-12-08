package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ComboItemDTO {
    private int productId;
    private String productName;
    private int comboId;
    private int quantity;
    private String note;
}
