package com.capstone.tamtech.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderListDTO {
    private int id;
    private String orderStatus;
    private Date orderDate;
    private Date paymentTime;
    private Date deliveryAt;

    private String customerName;
    private String customerPhone;
    private String address;

    private String branchName;
    private String branchAddress;

    private double subTotal;
    private double shippingFee;
    private double discountValue;
    private double amount;

    private String promotionCode;
    private int pointUsed;
    private int pointEarned;

    private boolean isPickUp;
    private boolean isTable;

    private String shipperName;
    private String waiterName;
    private String chefName;
    private String paymentMethod;
    private int itemCount;
}
