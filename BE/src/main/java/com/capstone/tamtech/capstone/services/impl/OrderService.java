package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;

public interface OrderService {

    public OrderDTO createOrderForShipping(OrderRequest orderRequest);
}
