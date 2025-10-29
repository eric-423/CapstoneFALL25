package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.entities.MaterialWarehouse;
import com.capstone.tamtech.capstone.entities.ProductRecipes;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;
import com.capstone.tamtech.capstone.repositories.MaterialWarehouseRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.services.impl.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private ProductRecipesRepository productRecipesRepository;

    @Autowired
    private MaterialWarehouseRepository materialWarehouseRepository;

    @Override
    public void assertSufficientMaterialsForOrder(List<OrderItemRequest> orderItems) {
        if (orderItems == null || orderItems.isEmpty()) {
            return;
        }

        Map<Integer, Double> requiredMaterialToQty = new HashMap<>();

        for (OrderItemRequest item : orderItems) {
            if (item.getProductId() > 0 && item.getQuantity() > 0) {
                List<ProductRecipes> recipes = productRecipesRepository
                        .findByKeyProductRecipesProductId(item.getProductId());
                for (ProductRecipes recipe : recipes) {
                    int materialId = recipe.getMaterial().getId();
                    double perUnitQty = recipe.getQuantity();
                    double need = perUnitQty * item.getQuantity();
                    requiredMaterialToQty.merge(materialId, need, Double::sum);
                }
            }
        }

        if (requiredMaterialToQty.isEmpty()) {
            return;
        }

        Map<Integer, Double> availableByMaterial = new HashMap<>();
        for (Integer materialId : requiredMaterialToQty.keySet()) {
            List<MaterialWarehouse> stocks = materialWarehouseRepository
                    .findByKeyMaterialWarehouseMaterialId(materialId);
            double total = 0.0;
            for (MaterialWarehouse mw : stocks) {
                total += mw.getQuantity();
            }
            availableByMaterial.put(materialId, total);
        }

        List<String> shortages = new ArrayList<>();
        for (Map.Entry<Integer, Double> e : requiredMaterialToQty.entrySet()) {
            int materialId = e.getKey();
            double required = e.getValue();
            double available = availableByMaterial.getOrDefault(materialId, 0.0);
            if (available + 1e-9 < required) {
                shortages.add("materialId=" + materialId + ", required=" + required + ", available=" + available);
            }
        }

        if (!shortages.isEmpty()) {
            throw new IllegalArgumentException("Không đủ nguyên liệu trong kho: " + String.join("; ", shortages));
        }
    }
}


