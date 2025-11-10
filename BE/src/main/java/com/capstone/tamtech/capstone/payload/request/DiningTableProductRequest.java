package com.capstone.tamtech.capstone.payload.request;

import com.capstone.tamtech.capstone.entities.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DiningTableProductRequest {

    private int diningTableId;

    private List<OrderItemRequest> orderItems;
}
