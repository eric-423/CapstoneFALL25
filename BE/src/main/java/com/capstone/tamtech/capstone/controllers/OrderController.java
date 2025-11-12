package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.DiningTablePaymentRequest;
import com.capstone.tamtech.capstone.payload.request.DiningTableProductRequest;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.payload.request.WaiterConfirmOrderRequest;
import com.capstone.tamtech.capstone.services.impl.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.models.responses.ApiResponse;
import org.apache.coyote.BadRequestException;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
@Tag(name = "Order Management", description = "API quản lý order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Value("${PAYOS_CLIENT_ID}")
    private String clientId;

    @Value("${PAYOS_API_KEY}")
    private String apiKey;

    @Value("${PAYOS_CHECKSUM_KEY}")
    private String checksumKey;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) throws BadRequestException {

        ResponseData responseData = new ResponseData();
        if (orderRequest.getMode().toUpperCase().equals("SHIPPING")) {
            HashMap<String, Object> value = new HashMap<>();
            responseData.setData(orderService.createOrderForShipping(orderRequest));
        } else if (orderRequest.getMode().toUpperCase().equals("DINING")) {
            responseData.setData(orderService.createOrderForDining(orderRequest));
        } else if (orderRequest.getMode().toUpperCase().equals("PICKUP")) {
            responseData.setData(orderService.createOrderForPickup(orderRequest));
        }
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PutMapping("/dining-table/update/{orderId}")
    public ResponseEntity<?> updateDiningTableOrder(@RequestBody DiningTableProductRequest diningTableProductRequest,
                                                    @PathVariable int orderId) throws BadRequestException {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.updateOrderForDining(orderId, diningTableProductRequest));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/dining-table/create")
    public ResponseEntity<?> createDiningTableOrder(@RequestBody OrderRequest orderRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.createOrderForDining(orderRequest));
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }


    @PostMapping("/payment/webhook")
    public ResponseEntity<String> paymentWebhook(@RequestBody Object body)
            throws JsonProcessingException, IllegalArgumentException {
        System.out.println("Received PayOS webhook: " + body.toString());
        PayOS payOS = new PayOS(clientId, apiKey, checksumKey);
        try {
            WebhookData data = payOS.webhooks().verify(body);
            System.out.println("Verified webhook data: " + data.toString());
            String code = data.getCode();
            int orderId = data.getOrderCode().intValue();

            if ("00".equalsIgnoreCase(code)) {
                System.out.println("Payment successful for order ID: " + orderId);
                orderService.markOrderPaidSuccess(orderId);
            } else {
                orderService.cancelOrder(orderId);
            }
            System.out.println(data);
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Cancel", HttpStatus.OK);
        }
    }

    @PutMapping("/manager/assign/cheff/{orderId}")
    public ResponseEntity<?> assignOrderToCheff(@PathVariable int orderId) {
        boolean result = orderService.assignOrderToCheff(orderId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/cheff/cooked/{orderId}")
    public ResponseEntity<?> markAsCooked(@PathVariable int orderId) {
        boolean result = orderService.markAsCooked(orderId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/manager/assign/shipper/{orderId}")
    public ResponseEntity<?> assignToShipper(@PathVariable int orderId) {
        boolean result = orderService.assignToShipper(orderId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/shipper/delivered/{orderId}")
    public ResponseEntity<?> deliveredOrder(@PathVariable int orderId) {
        boolean result = orderService.deliveredOrder(orderId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/customer/comleted/{orderId}")
    public ResponseEntity<?> completeOrder(@PathVariable int orderId) {
        boolean result = orderService.completeOrder(orderId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/shipping/fee")
    public ResponseEntity<?> getShippingFee(@RequestParam String customerAddress, @RequestParam String branchAddress)
            throws BadRequestException {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.calculateShippingFee(customerAddress, branchAddress));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/waiter/confirm")
    public ResponseEntity<?> confirmOrderItem(@RequestBody WaiterConfirmOrderRequest waiterConfirmOrderRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.confirmOrderItem(waiterConfirmOrderRequest));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/waiter/delivered")
    public ResponseEntity<?> confirmDeliveredOrderItem(
            @RequestBody WaiterConfirmOrderRequest waiterConfirmOrderRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.confirmDeliveredOrderItem(waiterConfirmOrderRequest));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/dining-table/payment")
    public ResponseEntity<?> payDiningTableOrder(@RequestBody DiningTablePaymentRequest paymentRequest)
            throws BadRequestException {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.payDiningTableOrder(paymentRequest));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/customer/pickup/{orderId}")
    public ResponseEntity<?> customerPickupOrder(@PathVariable int orderId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.customerPickedUpOrder(orderId));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}
