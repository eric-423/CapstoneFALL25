package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.DiningTableDTO;
import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.payload.request.DiningTableRequest;

import java.util.List;

public interface DiningTableService {


    List<DiningTableDTO> getAllDiningTables();

    DiningTableDTO getDiningTableById(int id);

    OrderDTO getCurrentOrderForDiningTable(int tableId);

    List<DiningTableDTO> getAllDiningTableWithBranch(int branchId);

    DiningTableDTO createDiningTable(DiningTableRequest diningTableRequest);

    boolean setDiningTableInactive(int id);

    DiningTableDTO updateDiningTable(int id, DiningTableRequest diningTableRequest);

    boolean setDiningTableActive(int id);
}
