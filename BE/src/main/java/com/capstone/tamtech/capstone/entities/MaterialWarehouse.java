package com.capstone.tamtech.capstone.entities;


import com.capstone.tamtech.capstone.entities.keys.KeyMaterialWarehouse;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "material_warehouse")
@Data
@NoArgsConstructor
public class MaterialWarehouse {

    @EmbeddedId
    private KeyMaterialWarehouse keyMaterialWarehouse;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "material_id", insertable = false, updatable = false)
    private Material material;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "warehouse_id", insertable = false, updatable = false)
    private Warehouse warehouse;

    @Column(name = "quantity")
    private double quantity;

    @Column(name = "threshold")
    private Double threshold;
}
