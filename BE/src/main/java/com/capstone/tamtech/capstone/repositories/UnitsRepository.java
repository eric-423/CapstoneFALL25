package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Units;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnitsRepository extends JpaRepository<Units, Integer> {
}
