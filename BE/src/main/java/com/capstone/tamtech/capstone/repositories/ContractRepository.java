package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {

    List<Contract> findByUserId(int userId);

    List<Contract> findByBranchId(int branchId);
}
