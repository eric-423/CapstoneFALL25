package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;

import java.util.List;

public interface InventoryService {

    void assertSufficientMaterialsForOrder(List<OrderItemRequest> orderItems);
}


