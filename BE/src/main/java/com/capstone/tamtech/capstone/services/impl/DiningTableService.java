package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.DiningTableDTO;

import java.util.List;

public interface DiningTableService {


    List<DiningTableDTO> getAllDiningTables();

    DiningTableDTO getDiningTableById(int id);

}
