package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "payment_method")
@Data
@NoArgsConstructor
public class PaymentMethod {

    @Column(name = "payment_method_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "payment_method_name")
    private String name;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "paymentMethod", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.REFRESH, CascadeType.DETACH })
    private List<Order> orderList;

}
