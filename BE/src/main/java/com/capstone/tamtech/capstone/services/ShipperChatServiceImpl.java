package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.MessageDTO;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.entities.keys.KeyChatRoomUser;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.ChatMessageRequest;
import com.capstone.tamtech.capstone.repositories.*;
import com.capstone.tamtech.capstone.services.impl.ShipperChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ShipperChatServiceImpl implements ShipperChatService {

    @Autowired
    private ChatRoomUserRepository chatRoomUserRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    private static final String ORDER_CHAT_PREFIX = "ORDER_";

    private Users resolveCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthenticated");
        }

        String principal = authentication.getName();

        return usersRepository.findByEmail(principal)
                .or(() -> usersRepository.findByPhoneNumber(principal))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isOrderParticipant(Order order, Users user) {
        if (order.getCustomer() != null && order.getCustomer().getId() == user.getId()) {
            return true;
        }
        if (order.getShipper() != null && order.getShipper().getId() == user.getId()) {
            return true;
        }
        return false;
    }

    private ChatRoom createOrderChatRoom(Order order, String roomName) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(roomName);
        chatRoom.setCreateAt(new Date());
        chatRoom.setMessages(new ArrayList<>());
        chatRoom.setChatRoomUserList(new ArrayList<>());
        chatRoom = chatRoomRepository.save(chatRoom);

        if (order.getCustomer() != null) {
            ensureUserInChatRoom(chatRoom, order.getCustomer());
        }
        if (order.getShipper() != null) {
            ensureUserInChatRoom(chatRoom, order.getShipper());
        }

        return chatRoom;
    }

    private void ensureUserInChatRoom(ChatRoom chatRoom, Users user) {
        if (user == null) {
            return;
        }

        KeyChatRoomUser key = new KeyChatRoomUser(chatRoom.getId(), user.getId());
        Optional<ChatRoomUser> existing = chatRoomUserRepository.findById(key);

        if (existing.isEmpty()) {
            ChatRoomUser cru = new ChatRoomUser();
            cru.setKeyChatRoomUser(key);
            cru.setChatRoom(chatRoom);
            cru.setUser(user);
            chatRoomUserRepository.save(cru);
        }
    }

    @Override
    public void sendOrderChatMessage(ChatMessageRequest request, Authentication authentication) {
        try {
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                return;
            }

            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

            Users sender = resolveCurrentUser(authentication);

            if (!isOrderParticipant(order, sender)) {
                throw new RuntimeException("User not authorized to chat for this order");
            }

            String roomName = ORDER_CHAT_PREFIX + order.getId();
            ChatRoom chatRoom = chatRoomRepository.findByName(roomName)
                    .orElseGet(() -> createOrderChatRoom(order, roomName));

            ensureUserInChatRoom(chatRoom, order.getCustomer());
            ensureUserInChatRoom(chatRoom, order.getShipper());

            Message message = new Message();
            message.setContent(request.getContent());
            message.setSendTime(new Date());
            message.setChatRoom(chatRoom);
            message.setSender(sender);
            message = messageRepository.save(message);

            MessageDTO dto = new MessageDTO();
            dto.setId(message.getId());
            dto.setContent(message.getContent());
            dto.setSenderId(message.getSender().getId());
            dto.setSendTime(message.getSendTime());

            messagingTemplate.convertAndSend("/topic/order/" + order.getId() + "/chat", dto);

        } catch (Exception e) {
            System.err.println("Error sending chat message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public List<MessageDTO> getOrderChatMessages(int orderId, Authentication authentication) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Users currentUser = resolveCurrentUser(authentication);

        if (!isOrderParticipant(order, currentUser)) {
            throw new RuntimeException("User not authorized to view chat for this order");
        }

        String roomName = ORDER_CHAT_PREFIX + order.getId();
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findByName(roomName);

        if (chatRoomOpt.isEmpty()) {
            return new ArrayList<>();
        }

        ChatRoom chatRoom = chatRoomOpt.get();
        List<Message> messages = messageRepository.findByChatRoomIdOrderBySendTimeAsc(chatRoom.getId());

        List<MessageDTO> dtos = new ArrayList<>();
        for (Message m : messages) {
            MessageDTO dto = new MessageDTO();
            dto.setId(m.getId());
            dto.setContent(m.getContent());
            dto.setSenderId(m.getSender().getId());
            dto.setSendTime(m.getSendTime());
            dtos.add(dto);
        }

        return dtos;
    }
}
