package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ComboSearchDTO;
import com.capstone.tamtech.capstone.entities.Combo;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ComboSearchRequest;
import com.capstone.tamtech.capstone.repositories.ComboRepository;
import com.capstone.tamtech.capstone.services.impl.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComboServiceImpl implements ComboService {

    @Autowired
    private ComboRepository comboRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ComboSearchDTO> searchCombos(ComboSearchRequest searchRequest) {
        Pageable pageable = createPageable(searchRequest);

        Page<Combo> page = comboRepository.searchCombos(
                searchRequest.getBranchId(),
                searchRequest.getKeyword(),
                searchRequest.getProductName(),
                searchRequest.getIsActive(),
                searchRequest.getMinPrice(),
                searchRequest.getMaxPrice(),
                pageable
        );

        List<ComboSearchDTO> content = page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return createPagedResponse(page, content);
    }

    private Pageable createPageable(ComboSearchRequest searchRequest) {
        int page = searchRequest.getPage() != null && searchRequest.getPage() >= 0 ? searchRequest.getPage() : 0;
        int size = searchRequest.getSize() != null && searchRequest.getSize() > 0 ? searchRequest.getSize() : 10;
        if (size > 100) {
            size = 100;
        }
        String sortBy = mapSortField(searchRequest.getSortBy());
        Sort.Direction direction = Sort.Direction.fromString(searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC");
        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return "name";
        }

        return switch (sortBy.toLowerCase()) {
            case "name" -> "name";
            case "price" -> "price";
            case "startdate" -> "startDate";
            case "enddate" -> "endDate";
            default -> "name";
        };
    }

    private ComboSearchDTO toDTO(Combo combo) {
        return ComboSearchDTO.builder()
                .comboId(combo.getId())
                .name(combo.getName())
                .description(combo.getDescription())
                .price(combo.getPrice())
                .isActive(combo.isActive())
                .startDate(combo.getStartDate())
                .endDate(combo.getEndDate())
                .branchId(combo.getBranch() != null ? combo.getBranch().getId() : null)
                .branchName(combo.getBranch() != null ? combo.getBranch().getName() : null)
                .build();
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
}


