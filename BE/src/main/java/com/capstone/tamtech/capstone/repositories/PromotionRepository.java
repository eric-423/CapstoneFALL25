package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, UUID> {
    Optional<Promotion> findByNameIgnoreCase(String name);

    List<Promotion> findByUserPromotions_Id_UserId(int userId);

    List<Promotion> findByUserPromotions_User_IdAndUserPromotions_UsageCountGreaterThanAndMinimumOrderValueGreaterThanEqual(int id, int usageCount, double minimumOrderValue);


}
