package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.DiningTableDTO;
import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.dto.OrderIemDTO;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.repositories.DiningTableRepository;
import com.capstone.tamtech.capstone.services.impl.DiningTableService;
import com.capstone.tamtech.capstone.services.impl.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class DiningTableServiceImpl implements DiningTableService {


    @Autowired
    private DiningTableRepository diningTableRepository;

    @Autowired
    private OrderServiceImpl orderServiceImpl;


    @Override
    public List<DiningTableDTO> getAllDiningTables() {

        List<DiningTable> diningTables = diningTableRepository.findAll();
        List<DiningTableDTO> diningTableDTOs = new ArrayList<>();
        diningTables.forEach(diningTable -> diningTableDTOs.add(toDTO(diningTable)));

        return diningTableDTOs;
    }

    @Override
    public DiningTableDTO getDiningTableById(int id) {
        DiningTable diningTable = diningTableRepository.findById(id).orElse(null);
        if (diningTable == null) {
            return null;
        }
        return toDTOWithOrders(diningTable);
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

    private DiningTableDTO toDTOWithOrders(DiningTable diningTable) {
        DiningTableDTO diningTableDTO = new DiningTableDTO();
        diningTableDTO.setId(diningTable.getId());
        diningTableDTO.setName(diningTable.getName());
        diningTableDTO.setIsActive(diningTable.getIsActive());
        diningTableDTO.setSeat(diningTable.getSeat());
        diningTableDTO.setNote(diningTable.getNote());
        diningTableDTO.setBranchId(diningTable.getBranch().getId());

        List<Order> allOrders = diningTable.getOrders();
        if (allOrders != null && !allOrders.isEmpty()) {
            List<OrderDTO> orderDTOs = allOrders.stream()
                    .map(orderServiceImpl::toDTO)
                    .collect(Collectors.toList());
            diningTableDTO.setOrders(orderDTOs);

            Order currentActiveOrder = allOrders.stream()
                    .filter(order -> order.getStatus() != null && 
                            !order.getStatus().getName().equalsIgnoreCase("COMPLETED") &&
                            !order.getStatus().getName().equalsIgnoreCase("CANCEL"))
                    .findFirst()
                    .orElse(null);
            
            if (currentActiveOrder != null) {
                diningTableDTO.setCurrentOrder(orderServiceImpl.toDTO(currentActiveOrder));
            }
        }

        return diningTableDTO;
    }
}
