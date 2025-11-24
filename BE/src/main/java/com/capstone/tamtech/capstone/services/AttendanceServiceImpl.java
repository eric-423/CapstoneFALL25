package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.AttendanceDTO;
import com.capstone.tamtech.capstone.dto.AttendanceSummaryDTO;
import com.capstone.tamtech.capstone.entities.Attendance;
import com.capstone.tamtech.capstone.entities.Branch;
import com.capstone.tamtech.capstone.entities.RoleHistory;
import com.capstone.tamtech.capstone.entities.Schedule;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.repositories.AttendanceRepository;
import com.capstone.tamtech.capstone.repositories.RoleHistoryRepository;
import com.capstone.tamtech.capstone.repositories.ScheduleRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RoleHistoryRepository roleHistoryRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    private static final int LATE_THRESHOLD_MINUTES = 15;

    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Unauthenticated");
        }
        String principal = authentication.getName();
        if (principal == null || principal.isBlank()) {
            throw new AccessDeniedException("Unauthenticated");
        }
        return usersRepository.findByEmail(principal)
                .or(() -> usersRepository.findByPhoneNumber(principal))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public AttendanceDTO checkIn() {
        Users currentUser = getCurrentUser();
        Date today = new Date(System.currentTimeMillis());
        Timestamp now = new Timestamp(System.currentTimeMillis());

        Optional<Attendance> existingAttendance = attendanceRepository.findByUserAndWorkDate(currentUser, today);
        if (existingAttendance.isPresent() && existingAttendance.get().getCheckIn() != null) {
            throw new IllegalArgumentException("Hôm nay đã check-in rồi");
        }

        Branch branch = null;
        Optional<RoleHistory> activeRoleHistory = roleHistoryRepository.findByUserAndIsActiveTrue(currentUser);
        if (activeRoleHistory.isPresent()) {
            branch = activeRoleHistory.get().getBranch();
        }

        Attendance attendance;
        if (existingAttendance.isPresent()) {
            attendance = existingAttendance.get();
        } else {
            attendance = new Attendance();
            attendance.setUser(currentUser);
            attendance.setBranch(branch);
            attendance.setWorkDate(today);
        }

        attendance.setCheckIn(now);

        List<Schedule> schedules = scheduleRepository.findByUserAndDate(currentUser, today);
        if (!schedules.isEmpty()) {
            Schedule schedule = schedules.get(0);
            if (schedule.getStartTime() != null) {
                LocalTime scheduleStartTime = schedule.getStartTime().toLocalTime();
                LocalTime checkInTime = now.toLocalDateTime().toLocalTime();

                long minutesLate = java.time.Duration.between(scheduleStartTime, checkInTime).toMinutes();

                if (minutesLate > LATE_THRESHOLD_MINUTES) {
                    attendance.setStatus("LATE");
                } else {
                    attendance.setStatus("ON_TIME");
                }
            } else {
                attendance.setStatus("ON_TIME");
            }
        } else {
            // Không có schedule, mặc định là ON_TIME
            attendance.setStatus("ON_TIME");
        }

        attendance = attendanceRepository.save(attendance);
        return toDTO(attendance);
    }

    @Override
    @Transactional
    public AttendanceDTO checkOut() {
        Users currentUser = getCurrentUser();
        Date today = new Date(System.currentTimeMillis());
        Timestamp now = new Timestamp(System.currentTimeMillis());

        Attendance attendance = attendanceRepository.findByUserAndWorkDate(currentUser, today)
                .orElseThrow(() -> new ResourceNotFoundException("Chưa check-in hôm nay"));

        if (attendance.getCheckIn() == null) {
            throw new IllegalArgumentException("Chưa check-in, không thể check-out");
        }

        if (attendance.getCheckOut() != null) {
            throw new IllegalArgumentException("Hôm nay đã check-out rồi");
        }

        attendance.setCheckOut(now);

        // Tính work_minutes
        long minutes = (attendance.getCheckOut().getTime() - attendance.getCheckIn().getTime()) / (1000 * 60);
        attendance.setWorkMinutes((int) minutes);

        // Kiểm tra về sớm (nếu có schedule)
        List<Schedule> schedules = scheduleRepository.findByUserAndDate(currentUser, today);
        if (!schedules.isEmpty()) {
            Schedule schedule = schedules.get(0);
            if (schedule.getEndTime() != null) {
                LocalTime scheduleEndTime = schedule.getEndTime().toLocalTime();
                LocalTime checkOutTime = now.toLocalDateTime().toLocalTime();

                if (checkOutTime.isBefore(scheduleEndTime)) {
                    long minutesEarly = java.time.Duration.between(checkOutTime, scheduleEndTime).toMinutes();
                    attendance.setNote("Về sớm " + minutesEarly + " phút");
                }
            }
        }

        attendance = attendanceRepository.save(attendance);
        return toDTO(attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDTO> getAttendanceList(Integer userId, Integer branchId, Date fromDate, Date toDate) {
        List<Attendance> attendances = attendanceRepository.findWithFilters(userId, branchId, fromDate, toDate);
        return attendances.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceSummaryDTO getAttendanceSummary(Integer userId, Integer year, Integer month) {
        if (userId == null || year == null || month == null) {
            throw new IllegalArgumentException("userId, year, và month là bắt buộc");
        }

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Attendance> attendances = attendanceRepository.findByUserIdAndMonth(userId, year, month);

        int totalWorkDays = 0;
        int totalWorkMinutes = 0;
        int lateDays = 0;
        int absentDays = 0;
        int onTimeDays = 0;

        Branch branch = null;
        Optional<RoleHistory> activeRoleHistory = roleHistoryRepository.findByUserAndIsActiveTrue(user);
        if (activeRoleHistory.isPresent()) {
            branch = activeRoleHistory.get().getBranch();
        }

        for (Attendance attendance : attendances) {
            if (attendance.getCheckIn() != null) {
                totalWorkDays++;
                if (attendance.getWorkMinutes() != null) {
                    totalWorkMinutes += attendance.getWorkMinutes();
                }
                if ("LATE".equals(attendance.getStatus())) {
                    lateDays++;
                } else if ("ON_TIME".equals(attendance.getStatus())) {
                    onTimeDays++;
                }
            } else {
                absentDays++;
            }
        }

        AttendanceSummaryDTO summary = new AttendanceSummaryDTO();
        summary.setUserId(userId);
        summary.setUserName(user.getFullName());
        summary.setBranchId(branch != null ? branch.getId() : null);
        summary.setBranchName(branch != null ? branch.getName() : null);
        summary.setTotalWorkDays(totalWorkDays);
        summary.setTotalWorkMinutes(totalWorkMinutes);
        summary.setTotalWorkHours(totalWorkMinutes / 60.0);
        summary.setLateDays(lateDays);
        summary.setAbsentDays(absentDays);
        summary.setOnTimeDays(onTimeDays);

        return summary;
    }

    private AttendanceDTO toDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setUserId(attendance.getUser().getId());
        dto.setUserName(attendance.getUser().getFullName());
        if (attendance.getBranch() != null) {
            dto.setBranchId(attendance.getBranch().getId());
            dto.setBranchName(attendance.getBranch().getName());
        }
        dto.setWorkDate(attendance.getWorkDate());
        dto.setCheckIn(attendance.getCheckIn());
        dto.setCheckOut(attendance.getCheckOut());
        dto.setStatus(attendance.getStatus());
        dto.setWorkMinutes(attendance.getWorkMinutes());
        dto.setNote(attendance.getNote());
        dto.setCreatedAt(attendance.getCreatedAt());
        dto.setUpdatedAt(attendance.getUpdatedAt());
        return dto;
    }
}
