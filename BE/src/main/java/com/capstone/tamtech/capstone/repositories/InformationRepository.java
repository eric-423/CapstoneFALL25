package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Information;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InformationRepository extends JpaRepository<Information, Integer> {

    List<Information> findByUserId(int userId);
}
