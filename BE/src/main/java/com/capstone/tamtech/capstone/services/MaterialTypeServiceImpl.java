package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.MaterialTypeDTO;
import com.capstone.tamtech.capstone.entities.MaterialType;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.MaterialTypeRequest;
import com.capstone.tamtech.capstone.payload.request.MaterialTypeSearchRequest;
import com.capstone.tamtech.capstone.repositories.MaterialRepository;
import com.capstone.tamtech.capstone.repositories.MaterialTypeRepository;
import com.capstone.tamtech.capstone.services.impl.MaterialTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MaterialTypeServiceImpl implements MaterialTypeService {

    @Autowired
    private MaterialTypeRepository materialTypeRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<MaterialTypeDTO> getAllMaterialTypes(MaterialTypeSearchRequest searchRequest) {
        Pageable pageable = createPageable(searchRequest);

        Page<MaterialType> materialTypePage;
        if (searchRequest.getIncludeDeleted() != null && searchRequest.getIncludeDeleted()) {
            materialTypePage = materialTypeRepository.findAll(pageable);
        } else {
            materialTypePage = materialTypeRepository.findByIsDeletedFalse(pageable);
        }

        List<MaterialTypeDTO> content = materialTypePage.getContent().stream()
                .map(this::toDTO)
                .toList();

        return createPagedResponse(materialTypePage, content);
    }

    private Pageable createPageable(MaterialTypeSearchRequest searchRequest) {
        int page = searchRequest.getPage() != null && searchRequest.getPage() >= 0
                ? searchRequest.getPage()
                : 0;
        int size = searchRequest.getSize() != null && searchRequest.getSize() > 0
                ? searchRequest.getSize()
                : 10;

        if (size > 100) {
            size = 100;
        }

        String sortBy = mapSortField(searchRequest.getSortBy());
        Sort.Direction direction = Sort.Direction.fromString(
                searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC");

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return "name";
        }

        return switch (sortBy.toLowerCase()) {
            case "name", "typename" -> "name";
            case "id", "typeid" -> "id";
            default -> "name";
        };
    }

    private <T> PagedResponse<T> createPagedResponse(Page<?> page, List<T> content) {
        PagedResponse<T> response = new PagedResponse<>();
        response.setContent(content);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());
        response.setFirst(page.isFirst());
        response.setEmpty(page.isEmpty());
        return response;
    }

    @Override
    public MaterialTypeDTO getMaterialTypeById(int id) {
        MaterialType materialType = materialTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material type not found"));
        return toDTO(materialType);
    }

    @Override
    public MaterialTypeDTO createMaterialType(MaterialTypeRequest request) {
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
    public MaterialTypeDTO updateMaterialType(int id, MaterialTypeRequest request) {
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
