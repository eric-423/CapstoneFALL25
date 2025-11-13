package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.OrderStatusDTO;
import com.capstone.tamtech.capstone.entities.OrderStatus;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.OrderStatusRequest;
import com.capstone.tamtech.capstone.repositories.OrderRepository;
import com.capstone.tamtech.capstone.repositories.OrderStatusRepository;
import com.capstone.tamtech.capstone.services.impl.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderStatusServiceImpl implements OrderStatusService {

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrderStatusDTO> getAllOrderStatuses() {
        return orderStatusRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderStatusDTO getOrderStatusById(int id) {
        OrderStatus status = orderStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order status not found"));
        return toDTO(status);
    }

    @Override
    @Transactional
    public OrderStatusDTO createOrderStatus(OrderStatusRequest request) {
        validateName(request.getName(), null);

        OrderStatus status = new OrderStatus();
        status.setName(request.getName().trim().toUpperCase());

        OrderStatus saved = orderStatusRepository.save(status);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public OrderStatusDTO updateOrderStatus(int id, OrderStatusRequest request) {
        OrderStatus status = orderStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order status not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            validateName(request.getName(), id);
            status.setName(request.getName().trim().toUpperCase());
        }

        OrderStatus updated = orderStatusRepository.save(status);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteOrderStatus(int id) {
        OrderStatus status = orderStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order status not found"));

        boolean isInUse = orderRepository.existsByStatus_Id(id);
        if (isInUse) {
            throw new IllegalStateException("Cannot delete order status because it is being used by orders");
        }

        orderStatusRepository.delete(status);
    }

    private void validateName(String name, Integer currentId) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Order status name must not be blank");
        }

        String normalized = name.trim().toUpperCase();
        orderStatusRepository.findByNameIgnoreCase(normalized).ifPresent(existing -> {
            if (currentId == null || existing.getId() != currentId) {
                throw new IllegalArgumentException("Order status with this name already exists");
            }
        });
    }

    private OrderStatusDTO toDTO(OrderStatus status) {
        return new OrderStatusDTO(status.getId(), status.getName());
    }
}
