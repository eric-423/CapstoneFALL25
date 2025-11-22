package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.OrderStatusDTO;
import com.capstone.tamtech.capstone.payload.request.OrderStatusRequest;

import java.util.List;

public interface OrderStatusService {
    List<OrderStatusDTO> getAllOrderStatuses();

    OrderStatusDTO getOrderStatusById(int id);

    OrderStatusDTO createOrderStatus(OrderStatusRequest request);

    OrderStatusDTO updateOrderStatus(int id, OrderStatusRequest request);

    void deleteOrderStatus(int id);
}
