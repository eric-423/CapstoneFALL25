package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.AttendanceDTO;
import com.capstone.tamtech.capstone.dto.AttendanceSummaryDTO;

import java.sql.Date;
import java.util.List;

public interface AttendanceService {

    AttendanceDTO checkIn();

    AttendanceDTO checkOut();

    List<AttendanceDTO> getAttendanceList(Integer userId, Integer branchId, Date fromDate, Date toDate);

    AttendanceSummaryDTO getAttendanceSummary(Integer userId, Integer year, Integer month);
}
