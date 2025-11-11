package com.capstone.tamtech.capstone.entities;

import com.capstone.tamtech.capstone.entities.keys.UserPromotionKey;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "user_promotion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPromotion {

    @EmbeddedId
    private UserPromotionKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne
    @MapsId("promotionId")
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Column(name = "received_date")
    private Date receivedDate = new Date();

    @Column(name = "used_date")
    private Date usedDate;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private UserPromotionStatus status = UserPromotionStatus.AVAILABLE;

    @Column(name = "usage_count")
    private int usageCount = 1;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    public enum UserPromotionStatus {
        AVAILABLE,
        USED,
        EXPIRED
    }
}
