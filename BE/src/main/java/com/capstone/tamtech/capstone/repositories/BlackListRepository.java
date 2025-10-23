package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.BlackList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlackListRepository extends JpaRepository<BlackList, Integer> {
}
