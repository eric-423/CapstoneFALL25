package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.ComboItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboItemRepository extends JpaRepository<ComboItem, Integer> {

    List<ComboItem> findByComboId(int comboId);

    List<ComboItem> findByProductId(int productId);
}
