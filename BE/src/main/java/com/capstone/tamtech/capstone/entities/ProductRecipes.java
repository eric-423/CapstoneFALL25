package com.capstone.tamtech.capstone.entities;



import com.capstone.tamtech.capstone.entities.keys.KeyProductRecipes;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@NoArgsConstructor
@Table(name = "product_recipes")
@Data
public class ProductRecipes {

    @EmbeddedId
    private KeyProductRecipes keyProductRecipes;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "material_id", insertable = false, updatable = false)
    private Material material;

    @Column(name = "quantity")
    private double quantity;

    @Column(name = "created_at")
    private Date createdAt = new Date();

}
