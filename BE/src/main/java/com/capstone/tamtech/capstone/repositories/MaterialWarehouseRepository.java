package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.MaterialWarehouse;
import com.capstone.tamtech.capstone.entities.keys.KeyMaterialWarehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialWarehouseRepository extends JpaRepository<MaterialWarehouse, KeyMaterialWarehouse> {

    List<MaterialWarehouse> findByKeyMaterialWarehouseMaterialId(int materialId);

    List<MaterialWarehouse> findByKeyMaterialWarehouseWarehouseId(int warehouseId);
}
