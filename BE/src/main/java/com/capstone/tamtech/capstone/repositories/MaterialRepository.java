package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {

    Optional<Material> findByName(String name);

    List<Material> findByMaterialTypeId(int materialTypeId);

    List<Material> findByIsDeletedFalse();
}
