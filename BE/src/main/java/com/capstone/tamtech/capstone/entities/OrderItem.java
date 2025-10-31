package com.capstone.tamtech.capstone.entities;


import com.capstone.tamtech.capstone.entities.keys.KeyOrderItem;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@Entity
@Table(name = "order_item")
public class OrderItem {

    @EmbeddedId
    private KeyOrderItem keyOrderItem;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    private Order order;

    @OneToOne
    @JoinColumn(name = "combo_id")
    private Combo combo;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private double price;

    @Column(name = "note")
    private String note;

    @Column(name = "feedback")
    private String feedback;

    @Column(name = "is_feedbacked")
    private Boolean isFeedbacked;

    @Column(name = "feedback_point")
    private Integer feedbackPoint;

    @Column(name = "expired_feedback_date")
    private Date expiredFeedBackDate;

    @Column(name = "is_confirm")
    private Boolean isConfirmed = true;

    @Column(name = "confirm_at")
    private Date confirmAt;

    @Column(name = "is_delivered")
    private Boolean isDelivered;

}
