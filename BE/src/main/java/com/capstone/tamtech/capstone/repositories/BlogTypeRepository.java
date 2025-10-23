package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.BlogType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogTypeRepository extends JpaRepository<BlogType, Integer> {

    Optional<BlogType> findByName(String name);
}
