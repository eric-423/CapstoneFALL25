package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.entities.OrderItem;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;

import java.util.List;

public interface InventoryService {

    void assertSufficientMaterialsForOrder(List<OrderItemRequest> orderItems, Integer branchId);

    void restoreMaterialsForOrderItems(List<OrderItem> orderItems, Integer branchId);

    void consumeMaterialsForOrderItems(List<OrderItem> orderItems, Integer branchId);

}
