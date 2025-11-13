package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.MaterialWarehouseDTO;
import com.capstone.tamtech.capstone.dto.WarehouseDTO;
import com.capstone.tamtech.capstone.payload.request.AddMaterialToWarehouseRequest;
import com.capstone.tamtech.capstone.payload.request.WarehouseRequest;

import java.util.List;

public interface WarehouseService {
    List<WarehouseDTO> getAllWarehouses();

    WarehouseDTO getWarehouseById(int warehouseId);

    List<MaterialWarehouseDTO> getMaterialsInWarehouse(int warehouseId);

    WarehouseDTO createWarehouse(WarehouseRequest request);

    WarehouseDTO updateWarehouse(int warehouseId, WarehouseRequest request);

    List<MaterialWarehouseDTO> addMaterialsToWarehouse(int warehouseId, AddMaterialToWarehouseRequest request);
}
