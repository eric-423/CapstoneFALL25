package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.DiningTableDTO;
import com.capstone.tamtech.capstone.dto.OrderDTO;

import java.util.List;

public interface DiningTableService {


    List<DiningTableDTO> getAllDiningTables();

    DiningTableDTO getDiningTableById(int id);

    OrderDTO getCurrentOrderForDiningTable(int tableId);
}
