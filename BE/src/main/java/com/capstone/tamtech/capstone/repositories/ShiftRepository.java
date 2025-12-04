package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Integer> {

    List<Shift> findByBranch_Id(int branchId);
}


