package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByPhoneNumber(String phoneNumber);

    Optional<Users> findByEmail(String email);

    @Query("SELECT u FROM Users u LEFT JOIN FETCH u.roleHistories rh LEFT JOIN FETCH rh.role WHERE u.phoneNumber = :phoneNumber AND rh.isActive = true")
    Optional<Users> findByPhoneNumberWithActiveRole(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT u FROM Users u LEFT JOIN FETCH u.roleHistories rh LEFT JOIN FETCH rh.role WHERE u.email = :email AND rh.isActive = true")
    Optional<Users> findByEmailWithActiveRole(@Param("email") String email);




}
