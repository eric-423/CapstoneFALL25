package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.UtensilsTypeDTO;
import com.capstone.tamtech.capstone.entities.UtensilsType;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.UtensilsTypeRequest;
import com.capstone.tamtech.capstone.payload.request.UtensilsTypeSearchRequest;
import com.capstone.tamtech.capstone.repositories.CookingUtensilRepository;
import com.capstone.tamtech.capstone.repositories.UtensilsTypeRepository;
import com.capstone.tamtech.capstone.services.impl.UtensilsTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UtensilsTypeServiceImpl implements UtensilsTypeService {

    @Autowired
    private UtensilsTypeRepository utensilsTypeRepository;

    @Autowired
    private CookingUtensilRepository cookingUtensilRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UtensilsTypeDTO> getUtensilsTypes(UtensilsTypeSearchRequest searchRequest) {
        Pageable pageable = buildPageable(searchRequest);

        Page<UtensilsType> page = utensilsTypeRepository.search(
                normalizeKeyword(searchRequest.getKeyword()),
                pageable);

        List<UtensilsTypeDTO> content = page.stream()
                .map(this::toDTO)
                .toList();

        return buildPagedResponse(page, content);
    }

    @Override
    @Transactional(readOnly = true)
    public UtensilsTypeDTO getUtensilsType(int id) {
        UtensilsType utensilsType = utensilsTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utensils type not found"));
        return toDTO(utensilsType);
    }

    @Override
    @Transactional
    public UtensilsTypeDTO createUtensilsType(UtensilsTypeRequest request) {
        validateName(request.getName());
        String normalizedName = request.getName().trim();

        if (utensilsTypeRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new IllegalArgumentException("Utensils type already exists");
        }

        UtensilsType utensilsType = new UtensilsType();
        utensilsType.setName(normalizedName);
        utensilsType.setDescription(request.getDescription());

        UtensilsType saved = utensilsTypeRepository.save(utensilsType);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public UtensilsTypeDTO updateUtensilsType(int id, UtensilsTypeRequest request) {
        UtensilsType utensilsType = utensilsTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utensils type not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            String normalizedName = request.getName().trim();
            if (utensilsTypeRepository.existsByNameIgnoreCaseAndIdNot(normalizedName, id)) {
                throw new IllegalArgumentException("Utensils type already exists");
            }
            utensilsType.setName(normalizedName);
        }

        if (request.getDescription() != null) {
            utensilsType.setDescription(request.getDescription());
        }

        UtensilsType updated = utensilsTypeRepository.save(utensilsType);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteUtensilsType(int id) {
        UtensilsType utensilsType = utensilsTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utensils type not found"));

        if (cookingUtensilRepository.existsByUtensilsTypeId(id)) {
            throw new IllegalStateException("Cannot delete utensils type that is currently in use");
        }

        utensilsTypeRepository.delete(utensilsType);
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
    }

    private UtensilsTypeDTO toDTO(UtensilsType entity) {
        UtensilsTypeDTO dto = new UtensilsTypeDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private Pageable buildPageable(UtensilsTypeSearchRequest searchRequest) {
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
            case "description" -> "description";
            case "name" -> "name";
            case "id" -> "id";
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
