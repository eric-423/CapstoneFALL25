package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.MessageDTO;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.payload.request.ChatMessageRequest;
import com.capstone.tamtech.capstone.services.impl.ShipperChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class ShipperChatController {

    @Autowired
    private ShipperChatService shipperChatService;

    @MessageMapping("/chat/order")
    public void sendOrderChatMessage(@Payload ChatMessageRequest request, Authentication authentication) {
        shipperChatService.sendOrderChatMessage(request, authentication);
    }

    @GetMapping("/orders/{orderId}/chat-messages")
    @ResponseBody
    public ResponseEntity<?> getOrderChatMessages(@PathVariable int orderId, Authentication authentication) {
        ResponseData responseData = new ResponseData();
        try {
            List<MessageDTO> dtos = shipperChatService.getOrderChatMessages(orderId, authentication);
            responseData.setData(dtos);
            responseData.setDesc("Chat messages retrieved successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setDesc(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
