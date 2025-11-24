package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.CookingUtensilDTO;
import com.capstone.tamtech.capstone.entities.CookingUtensil;
import com.capstone.tamtech.capstone.entities.UtensilsType;
import com.capstone.tamtech.capstone.entities.Warehouse;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.CookingUtensilRequest;
import com.capstone.tamtech.capstone.payload.request.CookingUtensilSearchRequest;
import com.capstone.tamtech.capstone.repositories.CookingUtensilRepository;
import com.capstone.tamtech.capstone.repositories.UtensilsTypeRepository;
import com.capstone.tamtech.capstone.repositories.WarehouseRepository;
import com.capstone.tamtech.capstone.services.impl.CookingUtensilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class CookingUtensilServiceImpl implements CookingUtensilService {

    @Autowired
    private CookingUtensilRepository cookingUtensilRepository;

    @Autowired
    private UtensilsTypeRepository utensilsTypeRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CookingUtensilDTO> getCookingUtensils(CookingUtensilSearchRequest searchRequest) {
        Pageable pageable = buildPageable(searchRequest);

        Page<CookingUtensil> page = cookingUtensilRepository.search(
                normalizeKeyword(searchRequest.getKeyword()),
                searchRequest.getUtensilsTypeId(),
                searchRequest.getWarehouseId(),
                pageable);

        List<CookingUtensilDTO> content = page.stream()
                .map(this::toDTO)
                .toList();

        return buildPagedResponse(page, content);
    }

    @Override
    @Transactional(readOnly = true)
    public CookingUtensilDTO getCookingUtensil(int id) {
        CookingUtensil cookingUtensil = cookingUtensilRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cooking utensil not found"));
        return toDTO(cookingUtensil);
    }

    @Override
    @Transactional
    public CookingUtensilDTO createCookingUtensil(CookingUtensilRequest request) {
        validateRequiredFields(request);

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        UtensilsType utensilsType = utensilsTypeRepository.findById(request.getUtensilsTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Utensils type not found"));

        String normalizedName = request.getName().trim();
        ensureUniqueName(normalizedName, warehouse.getId(), null);

        CookingUtensil cookingUtensil = new CookingUtensil();
        cookingUtensil.setName(normalizedName);
        cookingUtensil.setQuantity(request.getQuantity());
        cookingUtensil.setWarehouse(warehouse);
        cookingUtensil.setUtensilsType(utensilsType);

        CookingUtensil saved = cookingUtensilRepository.save(cookingUtensil);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public CookingUtensilDTO updateCookingUtensil(int id, CookingUtensilRequest request) {
        CookingUtensil cookingUtensil = cookingUtensilRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cooking utensil not found"));

        if (request.getWarehouseId() != null && (cookingUtensil.getWarehouse() == null
                || !Objects.equals(cookingUtensil.getWarehouse().getId(), request.getWarehouseId()))) {
            Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
            cookingUtensil.setWarehouse(warehouse);
        }

        if (request.getUtensilsTypeId() != null && (cookingUtensil.getUtensilsType() == null
                || !Objects.equals(cookingUtensil.getUtensilsType().getId(), request.getUtensilsTypeId()))) {
            UtensilsType utensilsType = utensilsTypeRepository.findById(request.getUtensilsTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Utensils type not found"));
            cookingUtensil.setUtensilsType(utensilsType);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            cookingUtensil.setName(request.getName().trim());
        }

        if (request.getQuantity() != null) {
            if (request.getQuantity() < 0) {
                throw new IllegalArgumentException("Quantity must be greater than or equal to 0");
            }
            cookingUtensil.setQuantity(request.getQuantity());
        }

        ensureUniqueName(cookingUtensil.getName(),
                cookingUtensil.getWarehouse() != null ? cookingUtensil.getWarehouse().getId() : null,
                cookingUtensil.getId());

        CookingUtensil updated = cookingUtensilRepository.save(cookingUtensil);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteCookingUtensil(int id) {
        CookingUtensil cookingUtensil = cookingUtensilRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cooking utensil not found"));
        cookingUtensilRepository.delete(cookingUtensil);
    }

    private void validateRequiredFields(CookingUtensilRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getQuantity() == null || request.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity must be provided and greater than or equal to 0");
        }
        if (request.getUtensilsTypeId() == null) {
            throw new IllegalArgumentException("Utensils type is required");
        }
        if (request.getWarehouseId() == null) {
            throw new IllegalArgumentException("Warehouse is required");
        }
    }

    private void ensureUniqueName(String name, Integer warehouseId, Integer currentId) {
        if (name == null || warehouseId == null) {
            return;
        }

        boolean exists;
        if (currentId == null) {
            exists = cookingUtensilRepository.existsByNameIgnoreCaseAndWarehouseId(name, warehouseId);
        } else {
            exists = cookingUtensilRepository.existsByNameIgnoreCaseAndWarehouseIdAndIdNot(name, warehouseId, currentId);
        }

        if (exists) {
            throw new IllegalArgumentException("Cooking utensil already exists in this warehouse");
        }
    }

    private CookingUtensilDTO toDTO(CookingUtensil entity) {
        CookingUtensilDTO dto = new CookingUtensilDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setQuantity(entity.getQuantity());

        if (entity.getUtensilsType() != null) {
            dto.setUtensilsTypeId(entity.getUtensilsType().getId());
            dto.setUtensilsTypeName(entity.getUtensilsType().getName());
        }

        if (entity.getWarehouse() != null) {
            dto.setWarehouseId(entity.getWarehouse().getId());
            dto.setWarehouseName(entity.getWarehouse().getAddress());
        }

        return dto;
    }

    private Pageable buildPageable(CookingUtensilSearchRequest searchRequest) {
        int page = searchRequest.getPage() != null && searchRequest.getPage() >= 0 ? searchRequest.getPage() : 0;
        int size = searchRequest.getSize() != null && searchRequest.getSize() > 0 ? searchRequest.getSize() : 10;
        size = Math.min(size, 100);

        Sort.Direction direction = Sort.Direction.fromString(
                searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC");
        String sortField = mapSortField(searchRequest.getSortBy());

        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "name";
        }

        return switch (sortBy.toLowerCase()) {
            case "quantity" -> "quantity";
            case "warehouse", "warehouseid", "warehouse_name" -> "warehouse.address";
            case "utensilstype", "utensilstypeid", "type" -> "utensilsType.name";
            case "name" -> "name";
            default -> "name";
        };
    }

    private <T> PagedResponse<T> buildPagedResponse(Page<?> page, List<T> content) {
        PagedResponse<T> response = new PagedResponse<>();
        response.setContent(content);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        response.setEmpty(page.isEmpty());
        return response;
    }

    private String normalizeKeyword(String keyword) {
        return (keyword == null || keyword.isBlank()) ? null : keyword.trim();
    }
}

