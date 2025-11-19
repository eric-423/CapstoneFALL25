package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT DISTINCT u FROM Users u " +
            "LEFT JOIN u.roleHistories rh ON rh.isActive = true " +
            "WHERE (:name IS NULL OR :name = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:phone IS NULL OR :phone = '' OR LOWER(u.phoneNumber) LIKE LOWER(CONCAT('%', :phone, '%'))) " +
            "AND (:email IS NULL OR :email = '' OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
            "AND (:role IS NULL OR :role = '' OR (rh IS NOT NULL AND rh.roleName = :role)) " +
            "AND (:branchId IS NULL OR (rh IS NOT NULL AND rh.branch.id = :branchId)) " +
            "AND (:status IS NULL OR u.isBan = :status)")
    Page<Users> searchUsers(
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("role") String role,
            @Param("branchId") Integer branchId,
            @Param("status") Boolean status,
            Pageable pageable);
}
