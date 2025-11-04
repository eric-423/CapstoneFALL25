package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.payload.request.DiningTablePaymentRequest;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.payload.request.WaiterConfirmOrderRequest;
import org.apache.coyote.BadRequestException;

public interface OrderService {

    public OrderDTO createOrderForShipping(OrderRequest orderRequest) throws BadRequestException;

    public void cancelOrder(int orderId);

    public void markOrderPaidSuccess(int orderId);

    boolean assignOrderToCheff(int orderId);

    boolean markAsCooked(int orderId);

    boolean assignToShipper(int orderId);

    boolean deliveredOrder(int orderId);

    boolean completeOrder(int orderId);

    public double calculateShippingFee(String customerAddress, String branchAddress) throws BadRequestException;

    OrderDTO createOrderForDining(OrderRequest orderRequest);

    Boolean confirmOrderItem(WaiterConfirmOrderRequest waiterConfirmOrderRequest);

    Boolean confirmDeliveredOrderItem(WaiterConfirmOrderRequest waiterConfirmOrderRequest);

    OrderDTO payDiningTableOrder(DiningTablePaymentRequest paymentRequest) throws BadRequestException;
}
