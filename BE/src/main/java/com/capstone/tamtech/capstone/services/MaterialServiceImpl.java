package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.MaterialDTO;
import com.capstone.tamtech.capstone.entities.Material;
import com.capstone.tamtech.capstone.entities.MaterialType;
import com.capstone.tamtech.capstone.entities.MaterialWarehouse;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.request.MaterialRequest;
import com.capstone.tamtech.capstone.repositories.MaterialRepository;
import com.capstone.tamtech.capstone.repositories.MaterialTypeRepository;
import com.capstone.tamtech.capstone.repositories.MaterialWarehouseRepository;
import com.capstone.tamtech.capstone.repositories.ProductRecipesRepository;
import com.capstone.tamtech.capstone.services.impl.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MaterialServiceImpl implements MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private MaterialTypeRepository materialTypeRepository;

    @Autowired
    private ProductRecipesRepository productRecipesRepository;

    @Autowired
    private MaterialWarehouseRepository materialWarehouseRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MaterialDTO> getAllMaterials(boolean includeDeleted) {
        List<Material> materials = includeDeleted ? materialRepository.findAll()
                : materialRepository.findByIsDeletedFalse();
        return materials.stream().map(this::toDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MaterialDTO getMaterialById(int id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));
        return toDTO(material);
    }

    @Override
    @Transactional
    public MaterialDTO createMaterial(MaterialRequest request) {
        materialRepository.findByName(request.getName()).ifPresent(m -> {
            throw new IllegalArgumentException("Material with the same name already exists");
        });

        MaterialType materialType = null;
        if (request.getMaterialTypeId() != null) {
            materialType = materialTypeRepository.findById(request.getMaterialTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Material type not found"));

            if (materialType.getIsDeleted() != null && materialType.getIsDeleted()) {
                throw new IllegalArgumentException("Cannot create material with deleted material type");
            }
        }

        Material material = new Material();
        material.setName(request.getName());
        material.setCaloriesPerUnit(request.getCaloriesPerUnit());
        material.setUnit(request.getUnit());
        material.setThreshold(request.getThreshold());
        material.setMaterialType(materialType);
        material.setIsDeleted(Boolean.FALSE);

        Material saved = materialRepository.save(material);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public MaterialDTO updateMaterial(int id, MaterialRequest request) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            materialRepository.findByName(request.getName()).ifPresent(m -> {
                if (m.getId() != id) {
                    throw new IllegalArgumentException("Material with the same name already exists");
                }
            });
            material.setName(request.getName());
        }

        if (request.getCaloriesPerUnit() != null) {
            material.setCaloriesPerUnit(request.getCaloriesPerUnit());
        }

        if (request.getUnit() != null && !request.getUnit().isBlank()) {
            material.setUnit(request.getUnit());
        }

        if (request.getThreshold() != null) {
            material.setThreshold(request.getThreshold());
        }

        if (request.getMaterialTypeId() != null) {
            MaterialType materialType = materialTypeRepository.findById(request.getMaterialTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Material type not found"));

            if (materialType.getIsDeleted() != null && materialType.getIsDeleted()) {
                throw new IllegalArgumentException("Cannot assign deleted material type to material");
            }

            material.setMaterialType(materialType);
        }

        Material updated = materialRepository.save(material);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteMaterial(int id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));

        boolean isUsedInRecipes = !productRecipesRepository.findByKeyProductRecipesMaterialId(id).isEmpty();
        if (isUsedInRecipes) {
            throw new IllegalStateException("Cannot delete material that is being used in product recipes");
        }

        material.setIsDeleted(Boolean.TRUE);
        materialRepository.save(material);
    }

    private MaterialDTO toDTO(Material material) {
        MaterialDTO dto = new MaterialDTO();
        dto.setId(material.getId());
        dto.setName(material.getName());
        dto.setCaloriesPerUnit(material.getCaloriesPerUnit());
        dto.setUnit(material.getUnit());
        dto.setThreshold(material.getThreshold());
        dto.setIsDeleted(material.getIsDeleted());

        double totalQuantity = 0.0;
        List<MaterialWarehouse> materialWarehouses = materialWarehouseRepository
                .findByKeyMaterialWarehouseMaterialId(material.getId());
        if (materialWarehouses != null) {
            totalQuantity = materialWarehouses.stream()
                    .mapToDouble(mw -> mw.getQuantity())
                    .sum();
        }
        dto.setQuantity(totalQuantity);

        if (material.getMaterialType() != null) {
            dto.setMaterialTypeId(material.getMaterialType().getId());
            dto.setMaterialTypeName(material.getMaterialType().getName());
        }

        return dto;
    }
}
