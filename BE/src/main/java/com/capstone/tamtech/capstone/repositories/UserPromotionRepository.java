package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.UserPromotion;
import com.capstone.tamtech.capstone.entities.keys.UserPromotionKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserPromotionRepository extends JpaRepository<UserPromotion, UserPromotionKey> {

    List<UserPromotion> findByIdUserId(int userId);

    List<UserPromotion> findByIdPromotionId(UUID promotionId);

    List<UserPromotion> findByIdUserIdAndStatus(int userId, UserPromotion.UserPromotionStatus status);

    @Query("SELECT up FROM UserPromotion up WHERE up.user.id = :userId AND up.status = 'AVAILABLE'")
    List<UserPromotion> findAvailablePromotionsByUserId(@Param("userId") int userId);

    boolean existsByIdUserIdAndIdPromotionId(int userId, UUID promotionId);

    long countByIdPromotionId(UUID promotionId);

    @Query("SELECT COUNT(up) FROM UserPromotion up WHERE up.user.id = :userId AND up.status = 'AVAILABLE'")
    long countAvailablePromotionsByUserId(@Param("userId") int userId);
}
