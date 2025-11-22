package com.capstone.tamtech.capstone.entities;


import com.capstone.tamtech.capstone.entities.keys.KeyBranchProduct;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
@Table(name = "branch_product")
public class BranchProduct {

    @EmbeddedId
    private KeyBranchProduct keyBranchProduct;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "branch_id", insertable = false, updatable = false)
    private Branch branch;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @Column(name = "quantity")
    private int quantity;

}
