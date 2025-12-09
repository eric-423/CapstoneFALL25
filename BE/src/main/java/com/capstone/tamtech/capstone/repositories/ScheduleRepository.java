package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Schedule;
import com.capstone.tamtech.capstone.entities.Shift;
import com.capstone.tamtech.capstone.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {

    List<Schedule> findByUser(Users user);

    @Query("SELECT s FROM Schedule s WHERE s.user = :user AND FUNCTION('DATE', s.date) = FUNCTION('DATE', :date)")
    List<Schedule> findByUserAndDate(@Param("user") Users user, @Param("date") Date date);

    @Query("SELECT s FROM Schedule s WHERE s.user.id = :userId AND FUNCTION('DATE', s.date) = FUNCTION('DATE', :date)")
    List<Schedule> findByUserIdAndDate(@Param("userId") int userId, @Param("date") Date date);

    @Query("SELECT s FROM Schedule s JOIN RoleHistory rh ON s.user.id = rh.user.id WHERE rh.isActive = true AND (:branchId IS NULL OR rh.branch.id = :branchId)")
    List<Schedule> findByBranchId(@Param("branchId") Integer branchId);

    @Query("SELECT COUNT(s) > 0 FROM Schedule s WHERE s.user = :user AND s.shift = :shift AND FUNCTION('DATE', s.date) = FUNCTION('DATE', :date)")
    boolean existsByUserAndShiftAndDate(@Param("user") Users user, @Param("shift") Shift shift,
            @Param("date") java.util.Date date);
}
