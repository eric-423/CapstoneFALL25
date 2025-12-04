package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ShiftDTO;
import com.capstone.tamtech.capstone.entities.Branch;
import com.capstone.tamtech.capstone.entities.Shift;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.ShiftRequest;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
import com.capstone.tamtech.capstone.repositories.ShiftRepository;
import com.capstone.tamtech.capstone.services.impl.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftServiceImpl implements ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Override
    public List<ShiftDTO> getAllShifts(Integer branchId) {
        List<Shift> shifts;
        if (branchId != null) {
            shifts = shiftRepository.findByBranch_Id(branchId);
        } else {
            shifts = shiftRepository.findAll();
        }
        return shifts.stream().map(this::toDTO).toList();
    }

    @Override
    public ShiftDTO getShiftById(int id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));
        return toDTO(shift);
    }

    @Override
    public ShiftDTO createShift(ShiftRequest request) {
        Shift shift = new Shift();
        shift.setName(request.getName());
        shift.setDescription(request.getDescription());
        shift.setStartTime(request.getStartTime());
        shift.setEndTime(request.getEndTime());
        shift.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        if (request.getBranchId() != null) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Branch not found with id: " + request.getBranchId()));
            shift.setBranch(branch);
        }

        Shift saved = shiftRepository.save(shift);
        return toDTO(saved);
    }

    @Override
    public ShiftDTO updateShift(int id, ShiftRequest request) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));

        if (request.getName() != null) {
            shift.setName(request.getName());
        }
        if (request.getDescription() != null) {
            shift.setDescription(request.getDescription());
        }
        if (request.getStartTime() != null) {
            shift.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            shift.setEndTime(request.getEndTime());
        }
        if (request.getIsActive() != null) {
            shift.setIsActive(request.getIsActive());
        }
        if (request.getBranchId() != null) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Branch not found with id: " + request.getBranchId()));
            shift.setBranch(branch);
        }

        Shift updated = shiftRepository.save(shift);
        return toDTO(updated);
    }

    private ShiftDTO toDTO(Shift shift) {
        ShiftDTO dto = new ShiftDTO();
        dto.setId(shift.getId());
        dto.setName(shift.getName());
        dto.setDescription(shift.getDescription());
        dto.setStartTime(shift.getStartTime());
        dto.setEndTime(shift.getEndTime());
        dto.setIsActive(shift.getIsActive());
        if (shift.getBranch() != null) {
            dto.setBranchId(shift.getBranch().getId());
            dto.setBranchName(shift.getBranch().getName());
        }
        return dto;
    }
}


