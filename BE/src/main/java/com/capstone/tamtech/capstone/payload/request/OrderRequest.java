package com.capstone.tamtech.capstone.payload.request;

import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderRequest {
    private int customerId;

    private String promotionCode;

    private double discountValue;

    private String shippingAddress;

    private String shippingPhoneNumber;

    private List<OrderItemRequest> orderItemList;

    private String mode;

    private int diningTableId;

}
