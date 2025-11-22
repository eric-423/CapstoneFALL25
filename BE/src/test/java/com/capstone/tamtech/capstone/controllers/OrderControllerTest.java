package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.OrderRequest;
import com.capstone.tamtech.capstone.services.impl.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testCreateOrder_Success() throws Exception {
        // Arrange
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setMode("SHIPPING");
        orderRequest.setCustomerId(23);
        
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1);
        orderDTO.setAmount(100000.0);
        
        when(orderService.createOrderForShipping(any(OrderRequest.class))).thenReturn(orderDTO);

        // Act & Assert
        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    void testAssignOrderToCheff_Success() throws Exception {
        // Arrange
        when(orderService.assignOrderToCheff(1)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get("/api/orders/manager/assign/cheff")
                .param("orderId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }

    @Test
    void testMarkAsCooked_Success() throws Exception {
        // Arrange
        when(orderService.markAsCooked(1)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get("/api/orders/cheff/cooked")
                .param("orderId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }

    @Test
    void testAssignToShipper_Success() throws Exception {
        // Arrange
        when(orderService.assignToShipper(1)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get("/api/orders/manager/assign/shipper")
                .param("orderId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }

    @Test
    void testDeliveredOrder_Success() throws Exception {
        // Arrange
        when(orderService.deliveredOrder(1)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get("/api/orders/shipper/delivered")
                .param("orderId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }

    @Test
    void testCompleteOrder_Success() throws Exception {
        // Arrange
        when(orderService.completeOrder(1)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get("/api/orders/customer/comleted")
                .contentType(MediaType.APPLICATION_JSON)
                .content("1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }
}

