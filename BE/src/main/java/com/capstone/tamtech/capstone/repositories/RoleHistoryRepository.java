package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.RoleHistory;
import com.capstone.tamtech.capstone.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleHistoryRepository extends JpaRepository<RoleHistory, Integer> {

    Optional<RoleHistory> findByUserAndIsActiveTrue(Users user);

    RoleHistory findByUser_Id(int id);


}
