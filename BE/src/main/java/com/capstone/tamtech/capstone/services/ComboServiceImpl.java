package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ComboDTO;
import com.capstone.tamtech.capstone.dto.ComboItemDTO;
import com.capstone.tamtech.capstone.dto.ComboSearchDTO;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ComboSearchRequest;
import com.capstone.tamtech.capstone.payload.request.CreateComboRequest;
import com.capstone.tamtech.capstone.payload.request.UpdateComboRequest;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
import com.capstone.tamtech.capstone.repositories.ComboItemRepository;
import com.capstone.tamtech.capstone.repositories.ComboRepository;
import com.capstone.tamtech.capstone.repositories.OrderItemRepository;
import com.capstone.tamtech.capstone.repositories.ProductRepository;
import com.capstone.tamtech.capstone.services.impl.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComboServiceImpl implements ComboService {

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ComboItemRepository comboItemRepository;

    @Autowired
    private ProductServiceImpl productServiceImpl;

    @Autowired
    private OrderItemRepository orderItemRepository;


    private Boolean isInStock(int comboId){
        List<ComboItem> comboItems = comboItemRepository.findByComboId(comboId);
        for (ComboItem item : comboItems) {
            Product product = item.getProduct();
            Branch branch = comboRepository.findById(comboId).get().getBranch();

            if (!productServiceImpl.isInStock(product, branch)) {
                return false;
            }
        }
        return true;
    }

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
                pageable);

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
        Sort.Direction direction = Sort.Direction
                .fromString(searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC");
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
                .isInStock(isInStock(combo.getId()))
                .build();
    }

    @Override
    @Transactional
    public ComboDTO createCombo(CreateComboRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        Combo combo = new Combo();
        combo.setName(request.getName());
        combo.setDescription(request.getDescription());
        combo.setPrice(request.getPrice());
        combo.setStartDate(request.getStartDate());
        combo.setEndDate(request.getEndDate());
        combo.setActive(request.getIsActive() != null ? request.getIsActive() : true);
        combo.setBranch(branch);
        combo.setCreatedAt(new Date());
        combo.setUpdatedAt(new Date());

        Combo savedCombo = comboRepository.save(combo);

        if (request.getComboItems() != null && !request.getComboItems().isEmpty()) {
            List<ComboItem> comboItems = new ArrayList<>();
            for (CreateComboRequest.ComboItemRequest itemReq : request.getComboItems()) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + itemReq.getProductId()));

                ComboItem comboItem = new ComboItem();
                comboItem.setCombo(savedCombo);
                comboItem.setProduct(product);
                comboItem.setQuantity(itemReq.getQuantity() != null ? itemReq.getQuantity() : 1);
                comboItem.setNote(itemReq.getNote());

                comboItems.add(comboItem);
            }
            comboItemRepository.saveAll(comboItems);
        }

        return toComboDTO(savedCombo);
    }

    @Override
    @Transactional
    public ComboDTO updateCombo(int comboId, UpdateComboRequest request) {
        Combo combo = comboRepository.findById(comboId)
                .orElseThrow(() -> new ResourceNotFoundException("Combo not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            combo.setName(request.getName());
        }
        if (request.getDescription() != null) {
            combo.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            combo.setPrice(request.getPrice());
        }
        if (request.getStartDate() != null) {
            combo.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            combo.setEndDate(request.getEndDate());
        }
        if (request.getIsActive() != null) {
            combo.setActive(request.getIsActive());
        }
        if (request.getBranchId() != null) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
            combo.setBranch(branch);
        }

        combo.setUpdatedAt(new Date());

        if (request.getComboItems() != null) {
            List<ComboItem> existingItems = comboItemRepository.findByComboId(comboId);
            comboItemRepository.deleteAll(existingItems);

            if (!request.getComboItems().isEmpty()) {
                List<ComboItem> comboItems = new ArrayList<>();
                for (UpdateComboRequest.ComboItemRequest itemReq : request.getComboItems()) {
                    Product product = productRepository.findById(itemReq.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Product not found with id: " + itemReq.getProductId()));

                    ComboItem comboItem = new ComboItem();
                    comboItem.setCombo(combo);
                    comboItem.setProduct(product);
                    comboItem.setQuantity(itemReq.getQuantity() != null ? itemReq.getQuantity() : 1);
                    comboItem.setNote(itemReq.getNote());

                    comboItems.add(comboItem);
                }
                comboItemRepository.saveAll(comboItems);
            }
        }

        Combo updatedCombo = comboRepository.save(combo);
        return toComboDTO(updatedCombo);
    }

    @Override
    @Transactional
    public void deleteCombo(int comboId) {
        Combo combo = comboRepository.findById(comboId)
                .orElseThrow(() -> new ResourceNotFoundException("Combo not found"));

        List<OrderItem> orderItems = orderItemRepository.findByComboId(comboId);
        if (!orderItems.isEmpty()) {
            combo.setActive(false);
            combo.setUpdatedAt(new Date());
            comboRepository.save(combo);
        } else {
            List<ComboItem> comboItems = comboItemRepository.findByComboId(comboId);
            comboItemRepository.deleteAll(comboItems);
            comboRepository.delete(combo);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ComboDTO getComboById(int comboId) {
        Combo combo = comboRepository.findById(comboId)
                .orElseThrow(() -> new ResourceNotFoundException("Combo not found"));
        return toComboDTO(combo);
    }

    private ComboDTO toComboDTO(Combo combo) {
        ComboDTO dto = new ComboDTO();
        dto.setId(combo.getId());
        dto.setName(combo.getName());
        dto.setDescription(combo.getDescription());
        dto.setPrice(combo.getPrice());
        dto.setStartDate(combo.getStartDate());
        dto.setEndDate(combo.getEndDate());
        dto.setActive(combo.isActive());
        dto.setBranchId(combo.getBranch() != null ? combo.getBranch().getId() : null);

        List<ComboItem> comboItems = comboItemRepository.findByComboId(combo.getId());
        List<ComboItemDTO> comboItemDTOs = comboItems.stream()
                .map(item -> {
                    ComboItemDTO itemDTO = new ComboItemDTO();
                    itemDTO.setComboId(item.getCombo().getId());
                    itemDTO.setProductId(item.getProduct().getId());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setNote(item.getNote());
                    return itemDTO;
                })
                .collect(Collectors.toList());

        dto.setComboItems(comboItemDTOs);
        return dto;
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
