package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.DiningTableDTO;
import com.capstone.tamtech.capstone.dto.OrderDTO;
import com.capstone.tamtech.capstone.dto.OrderIemDTO;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.DiningTableRequest;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
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

    @Autowired
    private BranchRepository branchRepository;

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

    @Override
    public OrderDTO getCurrentOrderForDiningTable(int tableId) {
        DiningTable diningTable = diningTableRepository.findById(tableId).orElseThrow(() -> new ResourceNotFoundException("Dining table not found"));

        List<Order> allOrders = diningTable.getOrders();
        if (allOrders != null && !allOrders.isEmpty()) {
            Order currentActiveOrder = allOrders.stream()
                    .filter(order -> order.getStatus() != null &&
                            !order.getStatus().getName().equalsIgnoreCase("COMPLETED") &&
                            !order.getStatus().getName().equalsIgnoreCase("CANCEL") &&
                            !order.getStatus().getName().equalsIgnoreCase("PAID"))
                    .findFirst()
                    .orElse(null);

            if (currentActiveOrder != null) {
                return orderServiceImpl.toDTO(currentActiveOrder);
            }
        }
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
                            !order.getStatus().getName().equalsIgnoreCase("CANCEL") &&
                            !order.getStatus().getName().equalsIgnoreCase("PAID"))
                    .findFirst()
                    .orElse(null);
            
            if (currentActiveOrder != null) {
                diningTableDTO.setCurrentOrder(orderServiceImpl.toDTO(currentActiveOrder));
            }
        }
        return diningTableDTO;
    }


    public List<DiningTableDTO> getAllDiningTableWithBranch(int branchId) {
        List<DiningTable> diningTables = diningTableRepository.findByBranch_Id(branchId);
        List<DiningTableDTO> diningTableDTOs = new ArrayList<>();
        diningTables.forEach(diningTable -> diningTableDTOs.add(toDTOWithOrders(diningTable)));

        return diningTableDTOs;
    }

    @Override
    public DiningTableDTO createDiningTable(DiningTableRequest diningTableRequest) {
        DiningTable diningTable = new DiningTable();
        Branch branch = branchRepository.findById(diningTableRequest.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + diningTableRequest.getBranchId()));

        diningTable.setName(diningTableRequest.getName());
        diningTable.setIsActive(diningTableRequest.getIsActive());
        diningTable.setSeat(diningTableRequest.getSeat());
        diningTable.setNote(diningTableRequest.getNote());
        diningTable.setBranch(branch);

        diningTableRepository.save(diningTable);
        return toDTO(diningTable);
    }

    @Override
    public boolean setDiningTableInactive(int id) {
        DiningTable diningTable = diningTableRepository.findById(id).orElse(null);
        if (diningTable != null) {
            diningTable.setIsActive(false);
            diningTableRepository.save(diningTable);
            return true;
        }
        return false;
    }

    @Override
    public DiningTableDTO updateDiningTable(int id, DiningTableRequest diningTableRequest) {
        DiningTable diningTable = diningTableRepository.findById(id).orElse(null);
        if (diningTable != null) {
            Branch branch = branchRepository.findById(diningTableRequest.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + diningTableRequest.getBranchId()));

            diningTable.setName(diningTableRequest.getName());
            diningTable.setIsActive(diningTableRequest.getIsActive());
            diningTable.setSeat(diningTableRequest.getSeat());
            diningTable.setNote(diningTableRequest.getNote());
            diningTable.setBranch(branch);

            return toDTO(diningTableRepository.save(diningTable));
        }
        return null;
    }

    @Override
    public boolean setDiningTableActive(int id) {
        DiningTable diningTable = diningTableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Dining table not found with id: " + id));
        if (diningTable != null) {
            diningTable.setIsActive(true);
            diningTableRepository.save(diningTable);
            return true;
        }
        return false;
    }


}
