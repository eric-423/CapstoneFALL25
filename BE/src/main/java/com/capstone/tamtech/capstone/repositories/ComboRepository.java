package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Combo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Integer> {

    List<Combo> findByIsActiveTrue();
}
