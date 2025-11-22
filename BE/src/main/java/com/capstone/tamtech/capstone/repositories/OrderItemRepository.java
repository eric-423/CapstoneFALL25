package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(int orderId);

    List<OrderItem> findByProductId(int productId);

    List<OrderItem> findByComboId(int comboId);
}
