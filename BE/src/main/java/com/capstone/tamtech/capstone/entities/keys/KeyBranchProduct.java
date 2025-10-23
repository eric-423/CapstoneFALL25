package com.capstone.tamtech.capstone.entities.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyBranchProduct implements Serializable {

    @Column(name = "branch_id")
    private int branchId;

    @Column(name = "product_id")
    private int productId;
}
