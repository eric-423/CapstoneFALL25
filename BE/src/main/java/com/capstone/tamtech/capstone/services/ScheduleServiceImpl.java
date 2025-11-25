package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ScheduleDTO;
import com.capstone.tamtech.capstone.entities.Schedule;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.ScheduleRequest;
import com.capstone.tamtech.capstone.repositories.ScheduleRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public ScheduleDTO createSchedule(ScheduleRequest request) {
        Schedule schedule = new Schedule();
        
        if (request.getUserId() != null) {
            Users user = usersRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
            schedule.setUser(user);
        }
        
        schedule.setName(request.getName());
        schedule.setDescription(request.getDescription());
        schedule.setDate(request.getDate());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        
        scheduleRepository.save(schedule);
        return mapToDTO(schedule);
    }

    @Override
    public ScheduleDTO updateSchedule(int id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        
        if (request.getUserId() != null) {
            Users user = usersRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
            schedule.setUser(user);
        }
        
        schedule.setName(request.getName());
        schedule.setDescription(request.getDescription());
        schedule.setDate(request.getDate());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        
        scheduleRepository.save(schedule);
        return mapToDTO(schedule);
    }

    @Override
    public ScheduleDTO getScheduleById(int id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        return mapToDTO(schedule);
    }

    @Override
    public List<ScheduleDTO> getAllSchedules() {
        List<Schedule> schedules = scheduleRepository.findAll();
        return schedules.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleDTO> getSchedulesByUserId(int userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        List<Schedule> schedules = scheduleRepository.findByUser(user);
        return schedules.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteSchedule(int id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        scheduleRepository.delete(schedule);
    }

    private ScheduleDTO mapToDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setName(schedule.getName());
        dto.setDescription(schedule.getDescription());
        dto.setDate(schedule.getDate());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        
        if (schedule.getUser() != null) {
            dto.setUserId(schedule.getUser().getId());
            dto.setUserName(schedule.getUser().getFullName());
        }
        
        return dto;
    }
}

