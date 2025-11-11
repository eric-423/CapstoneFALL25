package com.capstone.tamtech.capstone.entities.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPromotionKey implements Serializable {

    @Column(name = "user_id")
    private int userId;

    @Column(name = "promotion_id")
    private UUID promotionId;
}
