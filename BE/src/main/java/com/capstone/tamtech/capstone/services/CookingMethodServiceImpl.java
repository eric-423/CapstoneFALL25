package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.CookingMethodDTO;
import com.capstone.tamtech.capstone.entities.CookingMethod;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.CookingMethodRequest;
import com.capstone.tamtech.capstone.payload.request.CookingMethodSearchRequest;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;
import com.capstone.tamtech.capstone.repositories.CookingMethodRepository;
import com.capstone.tamtech.capstone.services.impl.CookingMehodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


@Service
public class CookingMethodServiceImpl implements CookingMehodService {

    @Autowired
    private CookingMethodRepository cookingMethodRepository;


    @Override
    public CookingMethodDTO createCookingMethod(CookingMethodRequest cookingMethodRequest) {
        CookingMethod cookingMethod = new CookingMethod();
        cookingMethod.setName(cookingMethodRequest.getName());
        cookingMethod.setDescription(cookingMethodRequest.getDescription());

        cookingMethodRepository.save(cookingMethod);
        return mapToDTO(cookingMethod);
    }

    private Pageable createPageable(CookingMethodSearchRequest searchRequest) {
        int page = searchRequest.getPage() != null && searchRequest.getPage() >= 0
                ? searchRequest.getPage()
                : 0;
        int size = searchRequest.getSize() != null && searchRequest.getSize() > 0
                ? searchRequest.getSize()
                : 10;

        if (size > 100) {
            size = 100;

        }


        Sort sort = Sort.by(Sort.Direction.fromString(
                searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC"));

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


    private CookingMethodDTO mapToDTO(CookingMethod cookingMethod) {
        CookingMethodDTO cookingMethodDTO = new CookingMethodDTO();
        cookingMethodDTO.setId(cookingMethod.getId());
        cookingMethodDTO.setName(cookingMethod.getName());
        cookingMethodDTO.setDescription(cookingMethod.getDescription());
        return cookingMethodDTO;
    }

    @Override
    public CookingMethodDTO updateCookingMethod(int id, CookingMethodRequest cookingMethodRequest) {
        CookingMethod cookingMethod = cookingMethodRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cooking Method not found"));
        cookingMethod.setDescription(cookingMethodRequest.getDescription());
        cookingMethod.setName(cookingMethodRequest.getName());
        cookingMethodRepository.save(cookingMethod);
        return mapToDTO(cookingMethod);
    }

    @Override
    public CookingMethodDTO getCookingMethodById(int id) {
        CookingMethod cookingMethod = cookingMethodRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cooking Method not found"));
        return mapToDTO(cookingMethod);
    }

    @Override
    public PagedResponse<CookingMethodDTO> getAllCookingMethods(CookingMethodSearchRequest cookingMethodSearchRequest) {
        String name = cookingMethodSearchRequest.getKeyword() != null ? cookingMethodSearchRequest.getKeyword() : "";
        String description = cookingMethodSearchRequest.getKeyword() != null ? cookingMethodSearchRequest.getKeyword() : "";
        Pageable pageable = createPageable(cookingMethodSearchRequest);
        Page<CookingMethod> cookingMethods = cookingMethodRepository.findByNameContainsIgnoreCaseOrDescriptionContainsIgnoreCase(name, description, pageable);
        List<CookingMethodDTO> content = cookingMethods.stream().map(this::mapToDTO).toList();

        return createPagedResponse(cookingMethods, content);
    }
}
