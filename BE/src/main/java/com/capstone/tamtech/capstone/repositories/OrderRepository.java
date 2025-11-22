package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    boolean existsByWorker_IdAndStatus_Name(int workerId, String statusName);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId ORDER BY o.createdAt DESC")
    List<Order> findByCustomerId(@Param("customerId") int customerId);

    List<Order> findByCustomer_IdAndStatus_NameOrderByCreatedAtDesc(int id, String name);

    @Query("SELECT o FROM Order o WHERE o.branch.id = :branchId ORDER BY o.createdAt DESC")
    List<Order> findByBranchId(@Param("branchId") int branchId);

    List<Order> findByBranch_IdAndStatus_NameOrderByCreatedAtDesc(int id, String name);

    boolean existsByStatus_Id(int statusId);

    List<Order> findByWorker_IdAndStatus_NameOrderByCreatedAtDesc(int id, String name);


}
