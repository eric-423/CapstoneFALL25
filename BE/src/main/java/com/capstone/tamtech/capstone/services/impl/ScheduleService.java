package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ScheduleDTO;
import com.capstone.tamtech.capstone.payload.request.ScheduleRequest;

import java.util.List;

public interface ScheduleService {
    ScheduleDTO createSchedule(ScheduleRequest request);

    ScheduleDTO updateSchedule(int id, ScheduleRequest request);

    ScheduleDTO getScheduleById(int id);

    List<ScheduleDTO> getAllSchedules();

    List<ScheduleDTO> getSchedulesByUserId(int userId);

    void deleteSchedule(int id);
}
