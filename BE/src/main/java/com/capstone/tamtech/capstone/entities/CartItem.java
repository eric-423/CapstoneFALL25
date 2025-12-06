package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cart_items")
@Entity
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private int cartId;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @ManyToOne(cascade = {jakarta.persistence.CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE, jakarta.persistence.CascadeType.REFRESH, jakarta.persistence.CascadeType.DETACH})
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(cascade = {jakarta.persistence.CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE, jakarta.persistence.CascadeType.REFRESH, jakarta.persistence.CascadeType.DETACH})
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne(cascade = {jakarta.persistence.CascadeType.PERSIST, jakarta.persistence.CascadeType.MERGE, jakarta.persistence.CascadeType.REFRESH, jakarta.persistence.CascadeType.DETACH})
    @JoinColumn(name = "combo_id")
    private Combo combo;
}
