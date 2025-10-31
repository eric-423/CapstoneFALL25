package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.payload.request.OrderItemRequest;
import com.capstone.tamtech.capstone.repositories.ComboRepository;
import com.capstone.tamtech.capstone.repositories.MaterialWarehouseRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.repositories.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceImplTest {

    @Mock
    private ProductRecipesRepository productRecipesRepository;

    @Mock
    private MaterialWarehouseRepository materialWarehouseRepository;

    @Mock
    private ComboRepository comboRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    private Product product;
    private Material material;
    private ProductRecipes recipe;
    private MaterialWarehouse materialWarehouse;
    private Combo combo;
    private ComboItem comboItem;

    @BeforeEach
    void setUp() {
        // Setup mock entities
        product = new Product();
        product.setId(1);
        product.setName("Test Product");

        material = new Material();
        material.setId(10);
        material.setName("Test Material");

        recipe = new ProductRecipes();
        recipe.setMaterial(material);
        recipe.setQuantity(0.5);

        materialWarehouse = new MaterialWarehouse();
        materialWarehouse.setQuantity(100.0);
        materialWarehouse.setMaterial(material);

        combo = new Combo();
        combo.setId(1);
        
        comboItem = new ComboItem();
        comboItem.setProduct(product);
        comboItem.setQuantity(2);
        combo.setComboItems(List.of(comboItem));
    }

    @Test
    void testAssertSufficientMaterialsForOrder_Success() {
        // Arrange
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1);
        itemRequest.setQuantity(2);

        when(productRecipesRepository.findByKeyProductRecipesProductId(1))
            .thenReturn(List.of(recipe));
        when(materialWarehouseRepository.findByKeyMaterialWarehouseMaterialId(10))
            .thenReturn(List.of(materialWarehouse));

        // Act & Assert
        assertDoesNotThrow(() -> inventoryService.assertSufficientMaterialsForOrder(List.of(itemRequest)));
    }

    @Test
    void testAssertSufficientMaterialsForOrder_InsufficientMaterials() {
        // Arrange
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1);
        itemRequest.setQuantity(500); // Request large quantity

        materialWarehouse.setQuantity(50.0); // Less than needed

        when(productRecipesRepository.findByKeyProductRecipesProductId(1))
            .thenReturn(List.of(recipe));
        when(materialWarehouseRepository.findByKeyMaterialWarehouseMaterialId(10))
            .thenReturn(List.of(materialWarehouse));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> inventoryService.assertSufficientMaterialsForOrder(List.of(itemRequest))
        );
        assertTrue(exception.getMessage().contains("Không đủ nguyên liệu"));
    }

    @Test
    void testConsumeMaterialsForOrderItems_Success() {
        // Arrange
        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(2);

        Warehouse warehouse = new Warehouse();
        warehouse.setId(1);
        materialWarehouse.setWarehouse(warehouse);

        when(productRecipesRepository.findByKeyProductRecipesProductId(1))
            .thenReturn(List.of(recipe));
        when(materialWarehouseRepository.findByKeyMaterialWarehouseMaterialId(10))
            .thenReturn(List.of(materialWarehouse));
        when(warehouseRepository.findAll()).thenReturn(List.of(warehouse));
        when(materialWarehouseRepository.save(any(MaterialWarehouse.class)))
            .thenReturn(materialWarehouse);

        // Act
        inventoryService.consumeMaterialsForOrderItems(List.of(orderItem), 1);

        // Assert
        verify(materialWarehouseRepository, atLeastOnce()).save(any(MaterialWarehouse.class));
    }

    @Test
    void testRestoreMaterialsForOrderItems_Success() {
        // Arrange
        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(2);

        Warehouse warehouse = new Warehouse();
        warehouse.setId(1);
        materialWarehouse.setWarehouse(warehouse);

        when(productRecipesRepository.findByKeyProductRecipesProductId(1))
            .thenReturn(List.of(recipe));
        when(materialWarehouseRepository.findByKeyMaterialWarehouseMaterialId(10))
            .thenReturn(List.of(materialWarehouse));
        when(warehouseRepository.findAll()).thenReturn(List.of(warehouse));
        when(materialWarehouseRepository.save(any(MaterialWarehouse.class)))
            .thenReturn(materialWarehouse);

        // Act
        inventoryService.restoreMaterialsForOrderItems(List.of(orderItem), 1);

        // Assert
        verify(materialWarehouseRepository, atLeastOnce()).save(any(MaterialWarehouse.class));
    }
}

