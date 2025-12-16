package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MessageDTO;
import com.capstone.tamtech.capstone.payload.request.ChatMessageRequest;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ShipperChatService {

    void sendOrderChatMessage(@Payload ChatMessageRequest request, Authentication authentication);

    List<MessageDTO> getOrderChatMessages(int orderId, Authentication authentication);
}
