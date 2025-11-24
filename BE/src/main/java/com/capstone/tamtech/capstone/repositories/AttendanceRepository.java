package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Attendance;
import com.capstone.tamtech.capstone.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    Optional<Attendance> findByUserAndWorkDate(Users user, Date workDate);

    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.workDate = :workDate")
    Optional<Attendance> findByUserIdAndWorkDate(@Param("userId") int userId, @Param("workDate") Date workDate);

    @Query("SELECT a FROM Attendance a WHERE " +
            "(:userId IS NULL OR a.user.id = :userId) AND " +
            "(:branchId IS NULL OR a.branch.id = :branchId) AND " +
            "(:fromDate IS NULL OR a.workDate >= :fromDate) AND " +
            "(:toDate IS NULL OR a.workDate <= :toDate) " +
            "ORDER BY a.workDate DESC, a.user.fullName")
    List<Attendance> findWithFilters(
            @Param("userId") Integer userId,
            @Param("branchId") Integer branchId,
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate);

    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND " +
            "YEAR(a.workDate) = :year AND MONTH(a.workDate) = :month " +
            "ORDER BY a.workDate")
    List<Attendance> findByUserIdAndMonth(@Param("userId") int userId, @Param("year") int year,
            @Param("month") int month);
}
