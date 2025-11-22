package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "promotion_type")
@Data
@NoArgsConstructor
public class PromotionType {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "promotion_type_id")
    private int id;

    @Column(name = "promotion_type_name")
    private String name;

    @OneToMany(mappedBy = "promotionType", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private List<Promotion> promotions;
}
