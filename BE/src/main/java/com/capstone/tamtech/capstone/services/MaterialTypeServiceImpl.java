package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.MaterialTypeDTO;
import com.capstone.tamtech.capstone.entities.MaterialType;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.repositories.MaterialRepository;
import com.capstone.tamtech.capstone.repositories.MaterialTypeRepository;
import com.capstone.tamtech.capstone.services.impl.MaterialTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialTypeServiceImpl implements MaterialTypeService {

    @Autowired
    private MaterialTypeRepository materialTypeRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    public List<MaterialTypeDTO> getAllMaterialTypes(boolean includeDeleted) {
        List<MaterialType> materialTypes = includeDeleted ? materialTypeRepository.findAll()
                : materialTypeRepository.findByIsDeletedFalse();
        return materialTypes.stream().map(this::toDTO).toList();
    }

    @Override
    public MaterialTypeDTO getMaterialTypeById(int id) {
        MaterialType materialType = materialTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material type not found"));
        return toDTO(materialType);
    }

    @Override
    public MaterialTypeDTO createMaterialType(MaterialTypeDTO request) {
        materialTypeRepository.findByName(request.getName()).ifPresent(mt -> {
            throw new IllegalArgumentException("Material type with the same name already exists");
        });

        MaterialType materialType = new MaterialType();
        materialType.setName(request.getName());
        materialType.setIsDeleted(Boolean.FALSE);

        MaterialType saved = materialTypeRepository.save(materialType);
        return toDTO(saved);
    }

    @Override
    public MaterialTypeDTO updateMaterialType(int id, MaterialTypeDTO request) {
        MaterialType materialType = materialTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material type not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            materialType.setName(request.getName());
        }

        MaterialType updated = materialTypeRepository.save(materialType);
        return toDTO(updated);
    }

    @Override
    public void deleteMaterialType(int id) {
        MaterialType materialType = materialTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material type not found"));

        boolean hasMaterials = !materialRepository.findByMaterialTypeId(materialType.getId()).isEmpty();
        if (hasMaterials) {
            throw new IllegalStateException("Cannot delete material type that is being used by materials");
        }

        materialType.setIsDeleted(Boolean.TRUE);
        materialTypeRepository.save(materialType);
    }

    private MaterialTypeDTO toDTO(MaterialType materialType) {
        return new MaterialTypeDTO(
                materialType.getId(),
                materialType.getName(),
                materialType.getIsDeleted());
    }
}
