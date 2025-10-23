package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.MaterialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialTypeRepository extends JpaRepository<MaterialType, Integer> {

    Optional<MaterialType> findByName(String name);
}
