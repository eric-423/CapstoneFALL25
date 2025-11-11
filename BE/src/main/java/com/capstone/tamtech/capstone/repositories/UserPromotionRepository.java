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

    // Tìm tất cả promotion của một user
    List<UserPromotion> findByIdUserId(int userId);

    // Tìm tất cả user đã nhận một promotion
    List<UserPromotion> findByIdPromotionId(UUID promotionId);

    // Tìm promotion của user theo trạng thái
    List<UserPromotion> findByIdUserIdAndStatus(int userId, UserPromotion.UserPromotionStatus status);

    // Tìm promotion available của user
    @Query("SELECT up FROM UserPromotion up WHERE up.user.id = :userId AND up.status = 'AVAILABLE'")
    List<UserPromotion> findAvailablePromotionsByUserId(@Param("userId") int userId);

    // Kiểm tra user đã có promotion này chưa
    boolean existsByIdUserIdAndIdPromotionId(int userId, UUID promotionId);

    // Đếm số lượng user đã nhận một promotion
    long countByIdPromotionId(UUID promotionId);

    // Đếm số promotion available của user
    @Query("SELECT COUNT(up) FROM UserPromotion up WHERE up.user.id = :userId AND up.status = 'AVAILABLE'")
    long countAvailablePromotionsByUserId(@Param("userId") int userId);
}
