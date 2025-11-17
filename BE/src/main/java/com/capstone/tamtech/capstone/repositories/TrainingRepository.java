package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Trainings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingRepository extends JpaRepository<Trainings, Integer> {

    Optional<Trainings> findByName(String name);

    List<Trainings> findByRoleId(int roleId);

    Page<Trainings> findByRoleId(int roleId, Pageable pageable);

    Page<Trainings> findByRoleIdAndIsActiveTrue(int roleId, Pageable pageable);

    List<Trainings> findByIsActiveTrue();

    Page<Trainings> findByIsActiveTrue(Pageable pageable);

    Page<Trainings> findAll(Pageable pageable);
}
