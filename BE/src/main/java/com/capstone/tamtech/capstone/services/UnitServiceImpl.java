package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.UnitDTO;
import com.capstone.tamtech.capstone.entities.Units;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.UnitRequest;
import com.capstone.tamtech.capstone.repositories.UnitsRepository;
import com.capstone.tamtech.capstone.services.impl.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnitServiceImpl implements UnitService {

    @Autowired
    private UnitsRepository unitsRepository;

    @Override
    public UnitDTO createUnit(UnitRequest request) {
        Units unit = new Units();
        unit.setName(request.getName());
        unit.setSymbols(request.getSymbols());

        unitsRepository.save(unit);
        return mapToDTO(unit);
    }

    @Override
    public UnitDTO updateUnit(int id, UnitRequest request) {
        Units unit = unitsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found with id: " + id));

        unit.setName(request.getName());
        unit.setSymbols(request.getSymbols());

        unitsRepository.save(unit);
        return mapToDTO(unit);
    }

    @Override
    public UnitDTO getUnitById(int id) {
        Units unit = unitsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found with id: " + id));
        return mapToDTO(unit);
    }

    @Override
    public List<UnitDTO> getAllUnits() {
        List<Units> units = unitsRepository.findAll();
        return units.stream().map(this::mapToDTO).toList();
    }

    @Override
    public void deleteUnit(int id) {
        Units unit = unitsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found with id: " + id));
        unitsRepository.delete(unit);
    }

    private UnitDTO mapToDTO(Units unit) {
        UnitDTO dto = new UnitDTO();
        dto.setId(unit.getId());
        dto.setName(unit.getName());
        dto.setSymbols(unit.getSymbols());
        return dto;
    }
}
