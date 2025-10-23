package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.PromotionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionTypeRepository extends JpaRepository<PromotionType, Integer> {

    Optional<PromotionType> findByName(String name);
}
