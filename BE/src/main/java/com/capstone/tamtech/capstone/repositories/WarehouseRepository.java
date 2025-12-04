package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Integer> {

    List<Warehouse> findByBranch_Id(int branchId);
}
