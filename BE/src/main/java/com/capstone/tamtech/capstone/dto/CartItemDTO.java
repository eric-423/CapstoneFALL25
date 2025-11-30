package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CartItemDTO {
    private int id;
    private int productId;
    private int comboId;
    private String comboName;
    private String productName;
    private int quantity;
    private String note;
}
