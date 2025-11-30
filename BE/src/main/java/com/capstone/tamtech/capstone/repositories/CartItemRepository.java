package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUser_Id(int id);

}
