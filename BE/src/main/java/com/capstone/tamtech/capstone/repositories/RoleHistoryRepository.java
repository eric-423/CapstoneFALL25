package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.RoleHistory;
import com.capstone.tamtech.capstone.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleHistoryRepository extends JpaRepository<RoleHistory, Integer> {

    Optional<RoleHistory> findByUserAndIsActiveTrue(Users user);

    RoleHistory findByUser_Id(int id);

    List<RoleHistory> findByRole_NameAndBranch_IdAndIsActiveTrue(String name, int id);

    @Query("""
            SELECT rh.user FROM RoleHistory rh
            WHERE rh.isActive = true
            AND (:roleId IS NULL OR rh.role.id = :roleId)
            AND (:branchId IS NULL OR rh.branch.id = :branchId)
            """)
    List<Users> findActiveUsersByRoleAndBranch(
            @Param("roleId") Integer roleId,
            @Param("branchId") Integer branchId);
}
