package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.OrderItem;
import com.capstone.tamtech.capstone.entities.keys.KeyOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, KeyOrderItem> {

    List<OrderItem> findByKeyOrderItemOrderId(int orderId);

    List<OrderItem> findByKeyOrderItemProductId(int productId);
}
