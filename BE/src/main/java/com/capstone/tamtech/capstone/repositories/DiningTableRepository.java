package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.DiningTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiningTableRepository extends JpaRepository<DiningTable, Integer> {
    List<DiningTable> findByBranch_Id(int id);

}
