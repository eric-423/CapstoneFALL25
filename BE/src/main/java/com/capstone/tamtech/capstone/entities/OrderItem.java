package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long id;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH })
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

    @Column(name = "delivered_at")
    private Date deliveredAt;

    @Column(name = "is_cooked")
    private Boolean isCooked;

    @Column(name = "cooked_at")
    private Date cookedAt;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Date();
        }
    }

}
