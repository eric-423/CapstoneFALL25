package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cooking_utensils")
@Data
@NoArgsConstructor
public class CookingUtensil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cooking_utensils_id")
    private int id;

    @Column(name  = "cooking_utensils_name")
    private String name;

    @Column(name = "cooking_utensils_quantity")
    private int quantity;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE,CascadeType.REFRESH,CascadeType.DETACH})
    @JoinColumn(name = "utensils_type_id")
    private UtensilsType utensilsType;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE,CascadeType.REFRESH,CascadeType.DETACH})
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;
}
