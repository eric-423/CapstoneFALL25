package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "warehouse")
@Data
@NoArgsConstructor
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "warehouse_name")
    private String address;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH,
            CascadeType.DETACH })
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @OneToMany(mappedBy = "warehouse", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.REFRESH,
            CascadeType.MERGE, CascadeType.DETACH })
    private List<MaterialWarehouse> materialWarehouses;

    @OneToMany(mappedBy = "warehouse", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.REFRESH,
            CascadeType.MERGE, CascadeType.DETACH })
    private List<CookingUtensil> cookingUtensils;

}
