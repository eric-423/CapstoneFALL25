package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.OrderStatusDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.OrderStatusRequest;
import com.capstone.tamtech.capstone.services.impl.OrderStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-statuses")
@CrossOrigin(origins = "*")
@Tag(name = "Order Status Management", description = "API quản lý trạng thái đơn hàng")
public class OrderStatusController {

    @Autowired
    private OrderStatusService orderStatusService;

    @Operation(summary = "Danh sách trạng thái đơn hàng")
    @GetMapping
    public ResponseEntity<?> getAllOrderStatuses() {
        try {
            List<OrderStatusDTO> statuses = orderStatusService.getAllOrderStatuses();
            ResponseData responseData = new ResponseData();
            responseData.setData(statuses);
            responseData.setDesc("Retrieved " + statuses.size() + " order status(es)");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Chi tiết trạng thái đơn hàng")
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderStatusById(
            @Parameter(description = "ID trạng thái", required = true) @PathVariable int id) {
        try {
            OrderStatusDTO status = orderStatusService.getOrderStatusById(id);
            ResponseData responseData = new ResponseData();
            responseData.setData(status);
            responseData.setDesc("Order status retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Tạo trạng thái đơn hàng")
    @PostMapping
    public ResponseEntity<?> createOrderStatus(@RequestBody OrderStatusRequest request) {
        try {
            OrderStatusDTO status = orderStatusService.createOrderStatus(request);
            ResponseData responseData = new ResponseData();
            responseData.setData(status);
            responseData.setDesc("Order status created successfully");
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Cập nhật trạng thái đơn hàng")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderStatus(
            @Parameter(description = "ID trạng thái", required = true) @PathVariable int id,
            @RequestBody OrderStatusRequest request) {
        try {
            OrderStatusDTO status = orderStatusService.updateOrderStatus(id, request);
            ResponseData responseData = new ResponseData();
            responseData.setData(status);
            responseData.setDesc("Order status updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Xóa trạng thái đơn hàng", description = "Chỉ xóa được nếu không có đơn hàng nào đang sử dụng.")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderStatus(
            @Parameter(description = "ID trạng thái", required = true) @PathVariable int id) {
        try {
            orderStatusService.deleteOrderStatus(id);
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Order status deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc("Error: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
