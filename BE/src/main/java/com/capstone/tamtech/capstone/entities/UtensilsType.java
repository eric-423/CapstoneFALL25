package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "utensils_type")
@Data
@NoArgsConstructor
public class UtensilsType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "utensils_type_id")
    private int id;

    @Column(name = "utensils_type_name")
    private String name;

    @Column(name = "utensils_type_description")
    private String description;

    @OneToMany(mappedBy = "utensilsType", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE,CascadeType.REFRESH,CascadeType.DETACH})
    private List<CookingUtensil> cookingUtensils;


}
