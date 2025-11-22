package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.dto.OrderListDTO;
import com.capstone.tamtech.capstone.payload.request.DiningTablePaymentRequest;
import com.capstone.tamtech.capstone.payload.request.DiningTableProductRequest;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.payload.request.WaiterConfirmOrderRequest;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface OrderService {

    public OrderDTO createOrderForShipping(OrderRequest orderRequest) throws BadRequestException;

    public OrderDTO createOrderForPickup(OrderRequest orderRequest) throws BadRequestException;

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

    boolean customerPickedUpOrder(int orderId);

    OrderDTO updateOrderForDining(int orderId, DiningTableProductRequest diningTableProductRequest);

    List<OrderListDTO> getCustomerOrders(int customerId, String status);

    List<OrderListDTO> getBranchOrders(int branchId, String status);

    OrderDTO getOrderById(int orderId);

    List<OrderListDTO> getOrdersByChefId(int chefId, String status);
}
