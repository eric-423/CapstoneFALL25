package com.capstone.tamtech.capstone.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "material_type")
@Data
@NoArgsConstructor
public class MaterialType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_type_id")
    private int id;

    @Column(name = "material_type_name")
    private String name;

    @OneToMany(mappedBy = "materialType", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE,CascadeType.REFRESH,CascadeType.DETACH})
    private List<Material> materials;

}
