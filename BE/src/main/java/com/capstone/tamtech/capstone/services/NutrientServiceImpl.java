package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.NutrientDTO;
import com.capstone.tamtech.capstone.entities.Nutrients;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.NutrientRequest;
import com.capstone.tamtech.capstone.payload.request.NutrientsSearchRequest;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;
import com.capstone.tamtech.capstone.repositories.NutrientRepository;
import com.capstone.tamtech.capstone.services.impl.NutrientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NutrientServiceImpl implements NutrientService {

    @Autowired
    private NutrientRepository nutrientRepository;

    @Override
    public NutrientDTO createNutrient(NutrientRequest request) {
        Nutrients nutrient = new Nutrients();
        nutrient.setName(request.getName());
        nutrient.setCode(request.getCode());
        nutrient.setUnit(request.getUnit());
        nutrient.setEnergyPerUnit(request.getEnergyPerUnit());

        nutrientRepository.save(nutrient);
        return mapToDTO(nutrient);
    }

    @Override
    public NutrientDTO updateNutrient(int id, NutrientRequest request) {
        Nutrients nutrient = nutrientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrient not found with id: " + id));

        nutrient.setName(request.getName());
        nutrient.setCode(request.getCode());
        nutrient.setUnit(request.getUnit());
        nutrient.setEnergyPerUnit(request.getEnergyPerUnit());

        nutrientRepository.save(nutrient);
        return mapToDTO(nutrient);
    }

    @Override
    public NutrientDTO getNutrientById(int id) {
        Nutrients nutrient = nutrientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrient not found with id: " + id));
        return mapToDTO(nutrient);
    }

    @Override
    public PagedResponse<NutrientDTO> getAllNutrients(NutrientsSearchRequest searchRequest) {
        Pageable pageable = createPageable(searchRequest);
        Page<Nutrients> nutrients = nutrientRepository.findByCodeContainsIgnoreCaseOrNameContainsIgnoreCaseOrUnitIgnoreCase(
                searchRequest.getKeyword() != null ? searchRequest.getKeyword() : "",
                searchRequest.getKeyword() != null ? searchRequest.getKeyword() : "",
                searchRequest.getUnit() != null ? searchRequest.getUnit() : "",
                pageable
        );

        List<NutrientDTO> content = nutrients.stream().map(this::mapToDTO).toList();
        return createPagedResponse(nutrients, content);
    }

    private Pageable createPageable(NutrientsSearchRequest nutrientsSearchRequest) {
        int page = nutrientsSearchRequest.getPage() != null && nutrientsSearchRequest.getPage() >= 0
                ? nutrientsSearchRequest.getPage()
                : 0;
        int size = nutrientsSearchRequest.getSize() != null && nutrientsSearchRequest.getSize() > 0
                ? nutrientsSearchRequest.getSize()
                : 10;

        if (size > 100) {
            size = 100;
        }
        Sort sort = Sort.by(Sort.Direction.fromString(
                nutrientsSearchRequest.getSortDirection() != null ? nutrientsSearchRequest.getSortDirection() : "ASC"));

        return PageRequest.of(page, size, sort);
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
    public void deleteNutrient(int id) {
        Nutrients nutrient = nutrientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrient not found with id: " + id));
        nutrientRepository.delete(nutrient);
    }

    private NutrientDTO mapToDTO(Nutrients nutrient) {
        NutrientDTO dto = new NutrientDTO();
        dto.setId(nutrient.getId());
        dto.setName(nutrient.getName());
        dto.setCode(nutrient.getCode());
        dto.setUnit(nutrient.getUnit());
        dto.setEnergyPerUnit(nutrient.getEnergyPerUnit());
        return dto;
    }
}
