package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.OrderListDTO;
import com.capstone.tamtech.capstone.dto.OrderStatusDTO;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.DiningTablePaymentRequest;
import com.capstone.tamtech.capstone.payload.request.DiningTableProductRequest;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.payload.request.WaiterConfirmOrderRequest;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.OrderService;
import com.capstone.tamtech.capstone.services.impl.OrderStatusService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
@Tag(name = "Order Management", description = "API quản lý order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderStatusService orderStatusService;

    @Value("${PAYOS_CLIENT_ID}")
    private String clientId;

    @Value("${PAYOS_API_KEY}")
    private String apiKey;

    @Value("${PAYOS_CHECKSUM_KEY}")
    private String checksumKey;

    @Autowired
    private UsersRepository usersRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) throws BadRequestException {

        ResponseData responseData = new ResponseData();
        if (orderRequest.getMode().toUpperCase().equals("SHIPPING")) {
            responseData.setData(orderService.createOrderForShipping(orderRequest));
        } else if (orderRequest.getMode().toUpperCase().equals("PICKUP")) {
            responseData.setData(orderService.createOrderForPickup(orderRequest));
        }
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable int orderId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.getOrderById(orderId));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
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

    @PutMapping("/staff/assign/cheff/{orderId}")
    public ResponseEntity<?> assignOrderToCheff(@PathVariable int orderId) {
        boolean result = orderService.assignOrderToCheff(orderId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/cheff/view/{chefId}")
    public ResponseEntity<?> getOrdersByChefId(@PathVariable int chefId, @RequestParam String status) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderService.getOrdersByChefId(chefId, status));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


    @PutMapping("/cheff/cooked/{orderId}")
    public ResponseEntity<?> markAsCooked(@PathVariable int orderId, @RequestBody List<Long> orderItemIds) {
        boolean result = orderService.markAsCooked(orderId, orderItemIds);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/staff/assign/shipper/{orderId}")
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

    @PutMapping("/staff/pickup/comleted/{orderId}")
    public ResponseEntity<?> completePickupOrderForStaff(@PathVariable int orderId) {
        boolean result = orderService.completePickupOrderForStaff(orderId);
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


    /**
     * Customer endpoint - Get orders of the authenticated customer
     * GET /api/orders/customer/my-orders?status=CREATED
     *
     * @param status         Optional order status filter (CREATED, IN_PROCESS,
     *                       DELIVERING, COMPLETED, CANCELLED, PAID, etc.)
     *                       Use "ALL" or omit to get all orders
     * @param authentication Spring Security authentication object
     * @return List of customer's orders
     */
    @GetMapping("/customer/my-orders")
    public ResponseEntity<?> getCustomerOrders(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        try {
            String principal = authentication.getName();
            Users customer = usersRepository.findByEmail(principal)
                    .orElseGet(() -> usersRepository.findByPhoneNumber(principal)
                            .orElseThrow(() -> new RuntimeException("Customer not found")));

            List<OrderListDTO> orders = orderService.getCustomerOrders(customer.getId(), status);

            ResponseData responseData = new ResponseData();
            responseData.setData(orders);
            responseData.setDesc("Retrieved " + orders.size() + " order(s) successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            responseData.setStatus(500);
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Staff endpoint - Get orders of the branch where the staff works
     * GET /api/orders/branch/my-branch?status=IN_PROCESS
     *
     * Available for: MANAGER, WAITER, CHEF, SHIPPER (any internal role)
     *
     * @param status         Optional order status filter
     * @param authentication Spring Security authentication object
     * @return List of branch's orders
     */
    @GetMapping("/branch/my-branch")
    public ResponseEntity<?> getBranchOrders(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Users user = usersRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRoleHistories().get(user.getRoleHistories().size() - 1).getBranch() == null) {
                ResponseData responseData = new ResponseData();
                responseData.setDesc("User is not assigned to any branch");
                return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
            }

            int branchId = user.getRoleHistories().get(user.getRoleHistories().size() - 1).getBranch().getId();
            List<OrderListDTO> orders = orderService.getBranchOrders(branchId, status);

            ResponseData responseData = new ResponseData();
            responseData.setData(orders);
            responseData.setDesc("Retrieved " + orders.size() + " order(s) from branch: "
                    + user.getRoleHistories().get(user.getRoleHistories().size() - 1).getBranch().getName());
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get order statuses (helper endpoint for frontend)
     * GET /api/orders/statuses
     */
    @GetMapping("/statuses")
    public ResponseEntity<?> getOrderStatuses() {
        try {
            List<OrderStatusDTO> statusDTOs = orderStatusService.getAllOrderStatuses();
            List<String> statuses = new ArrayList<>();
            statuses.add("ALL");
            statusDTOs.stream()
                    .map(OrderStatusDTO::getName)
                    .filter(name -> name != null && !name.isBlank())
                    .forEach(status -> statuses.add(status.toUpperCase()));

            ResponseData responseData = new ResponseData();
            responseData.setData(statuses);
            responseData.setDesc("Available order statuses");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

}
