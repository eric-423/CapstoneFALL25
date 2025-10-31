package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.entities.OrderItem;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;

import java.util.List;

public interface InventoryService {

    void assertSufficientMaterialsForOrder(List<OrderItemRequest> orderItems);

    void restoreMaterialsForOrderItems(List<OrderItem> orderItems, java.lang.Integer branchId);

    void consumeMaterialsForOrderItems(List<OrderItem> orderItems, java.lang.Integer branchId);
}


