package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.entities.Combo;
import com.capstone.tamtech.capstone.entities.ComboItem;
import com.capstone.tamtech.capstone.entities.MaterialWarehouse;
import com.capstone.tamtech.capstone.entities.OrderItem;
import com.capstone.tamtech.capstone.entities.Product;
import com.capstone.tamtech.capstone.entities.ProductRecipes;
import com.capstone.tamtech.capstone.entities.Warehouse;
import com.capstone.tamtech.capstone.entities.keys.KeyMaterialWarehouse;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
import com.capstone.tamtech.capstone.repositories.ComboRepository;
import com.capstone.tamtech.capstone.repositories.MaterialWarehouseRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.repositories.ProductRepository;
import com.capstone.tamtech.capstone.repositories.WarehouseRepository;
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

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BranchRepository branchRepository;

    private Integer resolveWarehouseIdByBranch(Integer branchId) {
        if (branchId == null)
            return null;
        return warehouseRepository.findAll().stream()
                .filter(w -> w.getBranch() != null && w.getBranch().getId() == branchId)
                .map(Warehouse::getId)
                .findFirst().orElse(null);
    }

    @Override
    public void assertSufficientMaterialsForOrder(List<OrderItemRequest> orderItems, Integer branchId) {
        if (orderItems == null || orderItems.isEmpty()) {
            return;
        }

        Map<Integer, Double> requiredMaterialToQty = new HashMap<>();

        for (OrderItemRequest item : orderItems) {
            if (item.getProductId() > 0 && item.getQuantity() > 0) {
                List<ProductRecipes> recipes = productRecipesRepository
                        .findByProductId(item.getProductId());
                for (ProductRecipes recipe : recipes) {
                    int materialId = recipe.getMaterial().getId();
                    double perUnitQty = recipe.getQuantity();
                    double need = perUnitQty * item.getQuantity();
                    requiredMaterialToQty.merge(materialId, need, Double::sum);
                }
            }
            if (item.getComboId() > 0 && item.getQuantity() > 0) {
                comboRepository.findById(item.getComboId()).ifPresent(combo -> {
                    if (combo.getComboItems() != null) {
                        combo.getComboItems().forEach(ci -> {
                            int productId = ci.getProduct().getId();
                            int productQty = ci.getQuantity() * item.getQuantity();
                            List<ProductRecipes> recipes = productRecipesRepository
                                    .findByProductId(productId);
                            for (ProductRecipes recipe : recipes) {
                                int materialId = recipe.getMaterial().getId();
                                double perUnitQty = recipe.getQuantity();
                                double need = perUnitQty * productQty;
                                requiredMaterialToQty.merge(materialId, need, Double::sum);
                            }
                        });
                    }
                });
            }
        }

        if (requiredMaterialToQty.isEmpty()) {
            return;
        }

        Integer warehouseId = resolveWarehouseIdByBranch(branchId);

        Map<Integer, Double> availableByMaterial = new HashMap<>();
        for (Integer materialId : requiredMaterialToQty.keySet()) {
            List<MaterialWarehouse> stocks = materialWarehouseRepository
                    .findByKeyMaterialWarehouseMaterialId(materialId);
            double total = 0.0;

            if (warehouseId != null) {
                for (MaterialWarehouse mw : stocks) {
                    if (mw.getWarehouse() != null && mw.getWarehouse().getId() == warehouseId) {
                        total += mw.getQuantity();
                    }
                }
            } else {
                for (MaterialWarehouse mw : stocks) {
                    total += mw.getQuantity();
                }
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
            throw new IllegalArgumentException(
                    "Không đủ nguyên liệu trong kho của chi nhánh: " + String.join("; ", shortages));
        }
    }

    @Override
    public void restoreMaterialsForOrderItems(List<OrderItem> orderItems, Integer branchId) {
        if (orderItems == null || orderItems.isEmpty()) {
            return;
        }

        Map<Integer, Double> materialToRestoreQty = new HashMap<>();

        for (OrderItem item : orderItems) {
            if (item.getProduct() != null && item.getQuantity() > 0) {
                int productId = item.getProduct().getId();
                int qty = item.getQuantity();
                List<ProductRecipes> recipes = productRecipesRepository
                        .findByProductId(productId);
                for (ProductRecipes recipe : recipes) {
                    int materialId = recipe.getMaterial().getId();
                    double perUnit = recipe.getQuantity();
                    double addBack = perUnit * qty;
                    materialToRestoreQty.merge(materialId, addBack, Double::sum);
                }
            }
            if (item.getCombo() != null && item.getQuantity() > 0 && item.getCombo().getComboItems() != null) {
                item.getCombo().getComboItems().forEach(ci -> {
                    int productId = ci.getProduct().getId();
                    int productQty = ci.getQuantity() * item.getQuantity();
                    List<ProductRecipes> recipes = productRecipesRepository
                            .findByProductId(productId);
                    for (ProductRecipes recipe : recipes) {
                        int materialId = recipe.getMaterial().getId();
                        double perUnit = recipe.getQuantity();
                        double addBack = perUnit * productQty;
                        materialToRestoreQty.merge(materialId, addBack, Double::sum);
                    }
                });
            }
        }

        if (materialToRestoreQty.isEmpty()) {
            return;
        }

        Integer warehouseId = resolveWarehouseIdByBranch(branchId);

        for (Map.Entry<Integer, Double> e : materialToRestoreQty.entrySet()) {
            int materialId = e.getKey();
            double restore = e.getValue();
            List<MaterialWarehouse> stocks = materialWarehouseRepository
                    .findByKeyMaterialWarehouseMaterialId(materialId);
            if (stocks != null && !stocks.isEmpty()) {
                if (warehouseId != null) {
                    for (MaterialWarehouse mw : stocks) {
                        if (mw.getWarehouse() != null && mw.getWarehouse().getId() == warehouseId) {
                            mw.setQuantity(mw.getQuantity() + restore);
                            materialWarehouseRepository.save(mw);
                            break;
                        }
                    }
                } else {
                    MaterialWarehouse mw = stocks.get(0);
                    mw.setQuantity(mw.getQuantity() + restore);
                    materialWarehouseRepository.save(mw);
                }
            }
        }
    }

    @Override
    public void consumeMaterialsForOrderItems(List<OrderItem> orderItems, Integer branchId) {
        if (orderItems == null || orderItems.isEmpty()) {
            return;
        }

        Map<Integer, Double> materialToConsumeQty = new HashMap<>();

        for (OrderItem item : orderItems) {
            if (item.getProduct() != null && item.getQuantity() > 0) {
                int productId = item.getProduct().getId();
                int qty = item.getQuantity();
                List<ProductRecipes> recipes = productRecipesRepository
                        .findByProductId(productId);
                for (ProductRecipes recipe : recipes) {
                    int materialId = recipe.getMaterial().getId();
                    double perUnit = recipe.getQuantity();
                    double need = perUnit * qty;
                    materialToConsumeQty.merge(materialId, need, Double::sum);
                }
            }
            if (item.getCombo() != null && item.getQuantity() > 0 && item.getCombo().getComboItems() != null) {
                item.getCombo().getComboItems().forEach(ci -> {
                    int productId = ci.getProduct().getId();
                    int productQty = ci.getQuantity() * item.getQuantity();
                    List<ProductRecipes> recipes = productRecipesRepository
                            .findByProductId(productId);
                    for (ProductRecipes recipe : recipes) {
                        int materialId = recipe.getMaterial().getId();
                        double perUnit = recipe.getQuantity();
                        double need = perUnit * productQty;
                        materialToConsumeQty.merge(materialId, need, Double::sum);
                    }
                });
            }
        }

        if (materialToConsumeQty.isEmpty()) {
            return;
        }

        Integer warehouseId = resolveWarehouseIdByBranch(branchId);

        for (Map.Entry<Integer, Double> e : materialToConsumeQty.entrySet()) {
            int materialId = e.getKey();
            double consume = e.getValue();
            List<MaterialWarehouse> stocks = materialWarehouseRepository
                    .findByKeyMaterialWarehouseMaterialId(materialId);
            double remaining = consume;
            if (warehouseId != null) {
                for (MaterialWarehouse mw : stocks) {
                    if (mw.getWarehouse() != null && mw.getWarehouse().getId() == warehouseId) {
                        double take = Math.min(mw.getQuantity(), remaining);
                        mw.setQuantity(mw.getQuantity() - take);
                        materialWarehouseRepository.save(mw);
                        remaining -= take;
                        break;
                    }
                }
            } else {
                for (MaterialWarehouse mw : stocks) {
                    if (remaining <= 0)
                        break;
                    double take = Math.min(mw.getQuantity(), remaining);
                    mw.setQuantity(mw.getQuantity() - take);
                    materialWarehouseRepository.save(mw);
                    remaining -= take;
                }
            }
            if (remaining > 1e-9) {
                throw new IllegalStateException(
                        "Kho không đủ trong quá trình trừ tồn. materialId=" + materialId + ", thiếu=" + remaining);
            }
        }
    }

    public int getAvailableProductQuantity(Integer productId, Integer branchId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + productId));

        branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi nhánh với ID: " + branchId));

        List<ProductRecipes> recipes = productRecipesRepository.findByProductId(productId);

        if (recipes == null || recipes.isEmpty()) {
            return 0;
        }

        Integer warehouseId = resolveWarehouseIdByBranch(branchId);
        if (warehouseId == null) {
            return 0;
        }

        int minAvailableQuantity = Integer.MAX_VALUE;

        for (ProductRecipes recipe : recipes) {
            int materialId = recipe.getMaterial().getId();
            double requiredQuantityPerProduct = recipe.getQuantity();

            if (requiredQuantityPerProduct <= 0) {
                continue;
            }

            KeyMaterialWarehouse key = new KeyMaterialWarehouse(materialId, warehouseId);
            double availableMaterialQuantity = materialWarehouseRepository
                    .findById(key)
                    .map(MaterialWarehouse::getQuantity)
                    .orElse(0.0);

            int productQuantityFromThisMaterial = (int) Math
                    .floor(availableMaterialQuantity / requiredQuantityPerProduct);

            minAvailableQuantity = Math.min(minAvailableQuantity, productQuantityFromThisMaterial);
        }

        return minAvailableQuantity == Integer.MAX_VALUE ? 0 : minAvailableQuantity;
    }

    public int getAvailableComboQuantity(Integer comboId, Integer branchId) {
        Combo combo = comboRepository.findById(comboId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy combo với ID: " + comboId));

        branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi nhánh với ID: " + branchId));

        if (combo.getComboItems() == null || combo.getComboItems().isEmpty()) {
            return 0;
        }

        Integer warehouseId = resolveWarehouseIdByBranch(branchId);
        if (warehouseId == null) {
            return 0;
        }

        int minAvailableComboQuantity = Integer.MAX_VALUE;

        for (ComboItem comboItem : combo.getComboItems()) {
            Product product = comboItem.getProduct();
            int productQuantityInCombo = comboItem.getQuantity();

            if (product == null || productQuantityInCombo <= 0) {
                continue;
            }

            List<ProductRecipes> recipes = productRecipesRepository.findByProductId(product.getId());
            if (recipes == null || recipes.isEmpty()) {
                return 0;
            }

            int minAvailableProductQuantity = Integer.MAX_VALUE;

            for (ProductRecipes recipe : recipes) {
                int materialId = recipe.getMaterial().getId();
                double requiredQuantityPerProduct = recipe.getQuantity();

                if (requiredQuantityPerProduct <= 0) {
                    continue;
                }

                KeyMaterialWarehouse key = new KeyMaterialWarehouse(materialId, warehouseId);
                double availableMaterialQuantity = materialWarehouseRepository
                        .findById(key)
                        .map(MaterialWarehouse::getQuantity)
                        .orElse(0.0);

                int productQuantityFromThisMaterial = (int) Math
                        .floor(availableMaterialQuantity / requiredQuantityPerProduct);

                minAvailableProductQuantity = Math.min(minAvailableProductQuantity, productQuantityFromThisMaterial);
            }

            if (minAvailableProductQuantity == Integer.MAX_VALUE) {
                return 0;
            }

            int comboQuantityFromThisProduct = minAvailableProductQuantity / productQuantityInCombo;
            minAvailableComboQuantity = Math.min(minAvailableComboQuantity, comboQuantityFromThisProduct);
        }

        return minAvailableComboQuantity == Integer.MAX_VALUE ? 0 : minAvailableComboQuantity;
    }
}
