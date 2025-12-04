package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ScheduleDTO;
import com.capstone.tamtech.capstone.payload.request.ScheduleRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ScheduleService {
    ScheduleDTO createSchedule(ScheduleRequest request);

    ScheduleDTO updateSchedule(int id, ScheduleRequest request);

    ScheduleDTO getScheduleById(int id);

    List<ScheduleDTO> getAllSchedules(Integer branchId);

    List<ScheduleDTO> getSchedulesByUserId(int userId);

    void deleteSchedule(int id);

    List<ScheduleDTO> importSchedules(MultipartFile file);
}
