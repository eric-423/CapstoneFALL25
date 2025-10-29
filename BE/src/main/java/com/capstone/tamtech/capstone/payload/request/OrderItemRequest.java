package com.capstone.tamtech.capstone.payload.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderItemRequest {

    private int productId;

    private int comboId;

    private int quantity;

    private double price;

    private String note;
}
