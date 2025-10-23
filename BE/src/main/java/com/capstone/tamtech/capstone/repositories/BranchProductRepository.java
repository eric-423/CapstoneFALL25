package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.BranchProduct;
import com.capstone.tamtech.capstone.entities.keys.KeyBranchProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchProductRepository extends JpaRepository<BranchProduct, KeyBranchProduct> {

    List<BranchProduct> findByKeyBranchProductBranchId(int branchId);

    List<BranchProduct> findByKeyBranchProductProductId(int productId);
}
