package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.MaterialWarehouseDTO;
import com.capstone.tamtech.capstone.dto.WarehouseDTO;
import com.capstone.tamtech.capstone.entities.Branch;
import com.capstone.tamtech.capstone.entities.Material;
import com.capstone.tamtech.capstone.entities.MaterialWarehouse;
import com.capstone.tamtech.capstone.entities.Warehouse;
import com.capstone.tamtech.capstone.entities.keys.KeyMaterialWarehouse;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.AddMaterialToWarehouseRequest;
import com.capstone.tamtech.capstone.payload.request.WarehouseRequest;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
import com.capstone.tamtech.capstone.repositories.MaterialRepository;
import com.capstone.tamtech.capstone.repositories.MaterialWarehouseRepository;
import com.capstone.tamtech.capstone.repositories.WarehouseRepository;
import com.capstone.tamtech.capstone.services.impl.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class WarehouseServiceImpl implements WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private MaterialWarehouseRepository materialWarehouseRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    public List<WarehouseDTO> getAllWarehouses() {
        List<Warehouse> warehouses = warehouseRepository.findAll();
        return warehouses.stream().map(this::toDTO).toList();
    }

    @Override
    public WarehouseDTO getWarehouseById(int warehouseId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        return toDTO(warehouse);
    }

    @Override
    public List<MaterialWarehouseDTO> getMaterialsInWarehouse(int warehouseId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        List<MaterialWarehouse> materialWarehouses = materialWarehouseRepository
                .findByKeyMaterialWarehouseWarehouseId(warehouseId);

        return materialWarehouses.stream().map(mw -> {
            MaterialWarehouseDTO dto = new MaterialWarehouseDTO();
            dto.setWarehouseId(warehouse.getId());
            dto.setWarehouseAddress(warehouse.getAddress());

            if (mw.getMaterial() != null) {
                dto.setMaterialId(mw.getMaterial().getId());
                dto.setMaterialName(mw.getMaterial().getName());
                if (mw.getMaterial().getMaterialType() != null) {
                    dto.setMaterialTypeName(mw.getMaterial().getMaterialType().getName());
                }
            }

            dto.setQuantity(mw.getQuantity());

            return dto;
        }).toList();
    }

    @Override
    @Transactional
    public WarehouseDTO createWarehouse(WarehouseRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        Warehouse warehouse = new Warehouse();
        warehouse.setAddress(request.getAddress());
        warehouse.setBranch(branch);
        warehouse.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        return toDTO(savedWarehouse);
    }

    @Override
    @Transactional
    public WarehouseDTO updateWarehouse(int warehouseId, WarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        warehouse.setAddress(request.getAddress());

        if (request.getIsActive() != null) {
            warehouse.setIsActive(request.getIsActive());
        }

        if (request.getBranchId() > 0) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
            warehouse.setBranch(branch);
        }

        Warehouse updatedWarehouse = warehouseRepository.save(warehouse);
        return toDTO(updatedWarehouse);
    }

    @Override
    @Transactional
    public List<MaterialWarehouseDTO> addMaterialsToWarehouse(int warehouseId, AddMaterialToWarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        List<MaterialWarehouseDTO> results = new ArrayList<>();

        for (AddMaterialToWarehouseRequest.MaterialItem item : request.getMaterials()) {
            Material material = materialRepository.findById(item.getMaterialId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Material not found with id: " + item.getMaterialId()));

            KeyMaterialWarehouse key = new KeyMaterialWarehouse(warehouseId, item.getMaterialId());

            MaterialWarehouse materialWarehouse = materialWarehouseRepository.findById(key).orElse(null);

            if (materialWarehouse == null) {
                materialWarehouse = new MaterialWarehouse();
                materialWarehouse.setKeyMaterialWarehouse(key);
                materialWarehouse.setWarehouse(warehouse);
                materialWarehouse.setMaterial(material);
                materialWarehouse.setQuantity(item.getQuantity());
            } else {
                materialWarehouse.setQuantity(materialWarehouse.getQuantity() + item.getQuantity());
            }

            materialWarehouseRepository.save(materialWarehouse);

            MaterialWarehouseDTO dto = new MaterialWarehouseDTO();
            dto.setWarehouseId(warehouse.getId());
            dto.setWarehouseAddress(warehouse.getAddress());
            dto.setMaterialId(material.getId());
            dto.setMaterialName(material.getName());
            if (material.getMaterialType() != null) {
                dto.setMaterialTypeName(material.getMaterialType().getName());
            }
            dto.setQuantity(materialWarehouse.getQuantity());

            results.add(dto);
        }

        return results;
    }

    private WarehouseDTO toDTO(Warehouse warehouse) {
        WarehouseDTO dto = new WarehouseDTO();
        dto.setId(warehouse.getId());
        dto.setAddress(warehouse.getAddress());
        dto.setIsActive(warehouse.getIsActive());

        if (warehouse.getBranch() != null) {
            dto.setBranchId(warehouse.getBranch().getId());
            dto.setBranchName(warehouse.getBranch().getName());
            dto.setBranchAddress(warehouse.getBranch().getAddress());
        }

        return dto;
    }
}
