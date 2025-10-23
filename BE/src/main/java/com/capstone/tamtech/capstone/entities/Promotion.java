package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "promotion")
@Data
@NoArgsConstructor
public class Promotion {

    @Id
    @Column(name = "promotion_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "promotion_name")
    private String name;

    @Column(name = "promotion_description")
    private String description;

    @Column(name = "promotion_discount")
    private int value;

    @Column(name = "minimum_order_value")
    private double minimumOrderValue;

    @Column(name = "promotion_start_date")
    private String startDate;

    @Column(name = "promotion_end_date")
    private String endDate;

    @Column(name = "promotion_status")
    private boolean status;

    @Column(name = "created_at")
    private Date createdAt;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "promotion_type_id")
    private PromotionType promotionType;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "user_id")
    private Users user;

}
