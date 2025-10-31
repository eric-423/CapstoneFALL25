package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.DiningTableDTO;
import com.capstone.tamtech.capstone.entities.DiningTable;
import com.capstone.tamtech.capstone.repositories.DiningTableRepository;
import com.capstone.tamtech.capstone.services.impl.DiningTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class DiningTableServiceImpl implements DiningTableService {


    @Autowired
    private DiningTableRepository diningTableRepository;


    @Override
    public List<DiningTableDTO> getAllDiningTables() {

        List<DiningTable> diningTables = diningTableRepository.findAll();
        List<DiningTableDTO> diningTableDTOs = new ArrayList<>();
        diningTables.forEach(diningTable -> diningTableDTOs.add(toDTO(diningTable)));

        return diningTableDTOs;
    }

    @Override
    public DiningTableDTO getDiningTableById(int id) {


        return null;
    }

    private DiningTableDTO toDTO(DiningTable diningTable) {
        DiningTableDTO diningTableDTO = new  DiningTableDTO();
        diningTableDTO.setId(diningTable.getId());
        diningTableDTO.setName(diningTable.getName());
        diningTableDTO.setIsActive(diningTable.getIsActive());
        diningTableDTO.setSeat(diningTable.getSeat());
        diningTableDTO.setNote(diningTable.getNote());
        diningTableDTO.setBranchId(diningTable.getBranch().getId());

        return  diningTableDTO;
    }
}
