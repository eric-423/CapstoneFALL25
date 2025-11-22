package com.capstone.tamtech.capstone.payload.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DiningTablePaymentRequest {

    private int orderId;
    private int paymentMethodId;
    private String promotionCode;
    private double discountValue;

}
