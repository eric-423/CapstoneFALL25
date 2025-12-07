package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.ShipperLocationDTO;
import com.capstone.tamtech.capstone.entities.Order;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.LocationUpdateRequest;
import com.capstone.tamtech.capstone.repositories.OrderRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@Controller
public class ShipperLocationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UsersRepository usersRepository;

    @MessageMapping("/shipper/location")
    public void updateShipperLocation(@Payload LocationUpdateRequest request, Authentication authentication) {
        try {
            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

            Users shipper = null;

            if (authentication != null) {
                String email = authentication.getName();
                shipper = usersRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("Shipper not found"));

                if (order.getShipper() == null || order.getShipper().getId() != shipper.getId()) {
                    throw new RuntimeException("Shipper not authorized for this order");
                }
            } else {
                shipper = order.getShipper();
            }

            order.setShipperLatitude(request.getLatitude());
            order.setShipperLongitude(request.getLongitude());
            order.setLocationUpdatedAt(new Date());
            orderRepository.save(order);

            ShipperLocationDTO locationDTO = new ShipperLocationDTO();
            locationDTO.setOrderId(order.getId());

            if (shipper != null) {
                locationDTO.setShipperId(shipper.getId());
                locationDTO.setShipperName(shipper.getFullName());
            } else {
                locationDTO.setShipperId(0);
                locationDTO.setShipperName("Test Shipper");
            }

            locationDTO.setLatitude(request.getLatitude());
            locationDTO.setLongitude(request.getLongitude());
            locationDTO.setTimestamp(new Date());
            locationDTO.setCustomerAddress(order.getAddress());

            messagingTemplate.convertAndSend("/topic/order/" + order.getId() + "/location", locationDTO);

        } catch (Exception e) {
            System.err.println("Error updating location: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @GetMapping("/orders/{orderId}/shipper-location")
    @ResponseBody
    public ResponseEntity<?> getShipperLocation(@PathVariable int orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

            if (order.getShipperLatitude() == null || order.getShipperLongitude() == null) {
                ResponseData responseData = new ResponseData();
                responseData.setDesc("Shipper location not available yet");
                return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
            }

            ShipperLocationDTO locationDTO = new ShipperLocationDTO();
            locationDTO.setOrderId(order.getId());

            if (order.getShipper() != null) {
                locationDTO.setShipperId(order.getShipper().getId());
                locationDTO.setShipperName(order.getShipper().getFullName());
            }

            locationDTO.setLatitude(order.getShipperLatitude());
            locationDTO.setLongitude(order.getShipperLongitude());
            locationDTO.setTimestamp(order.getLocationUpdatedAt());
            locationDTO.setCustomerAddress(order.getAddress());

            ResponseData responseData = new ResponseData();
            responseData.setData(locationDTO);
            responseData.setDesc("Shipper location retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/shipper/orders/{orderId}/location")
    @ResponseBody
    public ResponseEntity<?> updateLocationREST(
            @PathVariable int orderId,
            @RequestBody LocationUpdateRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Users shipper = usersRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Shipper not found"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

            if (order.getShipper() == null || order.getShipper().getId() != shipper.getId()) {
                throw new RuntimeException("Shipper not authorized for this order");
            }

            order.setShipperLatitude(request.getLatitude());
            order.setShipperLongitude(request.getLongitude());
            order.setLocationUpdatedAt(new Date());
            orderRepository.save(order);

            ShipperLocationDTO locationDTO = new ShipperLocationDTO();
            locationDTO.setOrderId(order.getId());
            locationDTO.setShipperId(shipper.getId());
            locationDTO.setShipperName(shipper.getFullName());
            locationDTO.setLatitude(request.getLatitude());
            locationDTO.setLongitude(request.getLongitude());
            locationDTO.setTimestamp(new Date());
            locationDTO.setCustomerAddress(order.getAddress());

            messagingTemplate.convertAndSend("/topic/order/" + order.getId() + "/location", locationDTO);

            ResponseData responseData = new ResponseData();
            responseData.setData(locationDTO);
            responseData.setDesc("Location updated successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            ResponseData responseData = new ResponseData();
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
