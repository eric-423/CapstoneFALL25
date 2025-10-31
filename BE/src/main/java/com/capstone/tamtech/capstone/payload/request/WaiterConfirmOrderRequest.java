package com.capstone.tamtech.capstone.payload.request;

import com.capstone.tamtech.capstone.entities.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class WaiterConfirmOrderRequest {
    private int  orderId;
    private int waiterId;
    private List<OrderItem> orderItems;
}
