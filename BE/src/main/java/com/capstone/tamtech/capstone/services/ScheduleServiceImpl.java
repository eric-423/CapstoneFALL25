package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ScheduleDTO;
import com.capstone.tamtech.capstone.entities.Schedule;
import com.capstone.tamtech.capstone.entities.Shift;
import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.ScheduleRequest;
import com.capstone.tamtech.capstone.repositories.ScheduleRepository;
import com.capstone.tamtech.capstone.repositories.ShiftRepository;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.services.impl.ScheduleService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    @Override
    @Transactional
    public ScheduleDTO createSchedule(ScheduleRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("userId is required");
        }
        if (request.getShiftId() == null) {
            throw new IllegalArgumentException("shiftId is required");
        }
        if (request.getDate() == null) {
            throw new IllegalArgumentException("date is required");
        }

        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        Shift shift = shiftRepository.findById(request.getShiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + request.getShiftId()));

        if (scheduleRepository.existsByUserAndShiftAndDate(user, shift, request.getDate())) {
            throw new IllegalArgumentException("Schedule for this user, shift and date already exists");
        }

        Schedule schedule = new Schedule();

        schedule.setUser(user);
        schedule.setShift(shift);

        schedule.setName(shift.getName());
        schedule.setDescription(request.getDescription() != null ? request.getDescription() : shift.getDescription());
        schedule.setDate(request.getDate());
        schedule.setStartTime(shift.getStartTime());
        schedule.setEndTime(shift.getEndTime());

        scheduleRepository.save(schedule);
        return mapToDTO(schedule);
    }

    @Override
    public List<ScheduleDTO> importSchedules(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        List<ScheduleDTO> createdSchedules = new ArrayList<>();

        try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                throw new IllegalArgumentException("Excel file has no sheets");
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }

                try {
                    Integer userId = getIntegerCellValue(row.getCell(0));
                    Integer shiftId = getIntegerCellValue(row.getCell(1));
                    Date date = getDateCellValue(row.getCell(2));
                    String description = getStringCellValue(row.getCell(3));

                    if (userId == null || shiftId == null || date == null) {
                        throw new IllegalArgumentException("userId, shiftId and date are required");
                    }

                    ScheduleRequest request = new ScheduleRequest();
                    request.setUserId(userId);
                    request.setShiftId(shiftId);
                    request.setDate(date);
                    request.setDescription(description);

                    ScheduleDTO dto = createSchedule(request);
                    createdSchedules.add(dto);
                } catch (Exception e) {
                    throw new IllegalArgumentException("Error at row " + (i + 1) + ": " + e.getMessage(), e);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read Excel file: " + e.getMessage(), e);
        }

        return createdSchedules;
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

        if (request.getShiftId() != null) {
            Shift shift = shiftRepository.findById(request.getShiftId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Shift not found with id: " + request.getShiftId()));
            schedule.setShift(shift);
            schedule.setName(shift.getName());
            schedule.setStartTime(shift.getStartTime());
            schedule.setEndTime(shift.getEndTime());
            if (request.getDescription() != null) {
                schedule.setDescription(request.getDescription());
            } else if (shift.getDescription() != null) {
                schedule.setDescription(shift.getDescription());
            }
        } else {
            if (request.getName() != null) {
                schedule.setName(request.getName());
            }
            if (request.getDescription() != null) {
                schedule.setDescription(request.getDescription());
            }
            if (request.getDate() != null) {
                schedule.setDate(request.getDate());
            }
            if (request.getStartTime() != null) {
                schedule.setStartTime(request.getStartTime());
            }
            if (request.getEndTime() != null) {
                schedule.setEndTime(request.getEndTime());
            }
        }

        if (request.getDate() != null) {
            schedule.setDate(request.getDate());
        }

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
    public List<ScheduleDTO> getAllSchedules(Integer branchId) {
        List<Schedule> schedules;
        if (branchId != null) {
            schedules = scheduleRepository.findByBranchId(branchId);
        } else {
            schedules = scheduleRepository.findAll();
        }
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
        if (schedule.getShift() != null) {
            dto.setShiftId(schedule.getShift().getId());
            dto.setShiftName(schedule.getShift().getName());
            if (schedule.getShift().getBranch() != null) {
                dto.setBranchId(schedule.getShift().getBranch().getId());
                dto.setBranchName(schedule.getShift().getBranch().getName());
            }
        }
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

    private Integer getIntegerCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        return switch (cell.getCellType()) {
            case NUMERIC -> (int) cell.getNumericCellValue();
            case STRING -> {
                String v = cell.getStringCellValue();
                yield v != null && !v.isBlank() ? Integer.parseInt(v.trim()) : null;
            }
            case FORMULA -> {
                if (cell.getCachedFormulaResultType() == CellType.NUMERIC) {
                    yield (int) cell.getNumericCellValue();
                } else if (cell.getCachedFormulaResultType() == CellType.STRING) {
                    String v = cell.getStringCellValue();
                    yield v != null && !v.isBlank() ? Integer.parseInt(v.trim()) : null;
                } else {
                    yield null;
                }
            }
            default -> null;
        };
    }

    private Date getDateCellValue(Cell cell) throws ParseException {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getDateCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            String text = cell.getStringCellValue();
            if (text == null || text.isBlank()) {
                return null;
            }
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            sdf.setLenient(false);
            return sdf.parse(text.trim());
        }
        return null;
    }

    private String getStringCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf(cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getStringCellValue();
            default -> null;
        };
    }
}
