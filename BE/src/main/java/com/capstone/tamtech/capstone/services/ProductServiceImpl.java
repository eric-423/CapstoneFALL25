package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ProductSearchDTO;
import com.capstone.tamtech.capstone.entities.BranchProduct;
import com.capstone.tamtech.capstone.entities.Product;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;
import com.capstone.tamtech.capstone.repositories.BranchProductRepository;
import com.capstone.tamtech.capstone.repositories.BranchRepository;
import com.capstone.tamtech.capstone.repositories.ProductRepository;
import com.capstone.tamtech.capstone.services.impl.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BranchProductRepository branchProductRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProductSearchDTO> searchProducts(ProductSearchRequest searchRequest) {
        if (searchRequest.getBranchId() == null) {
            throw new IllegalArgumentException("Branch ID là bắt buộc");
        }

        branchRepository.findById(searchRequest.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy chi nhánh với ID: " + searchRequest.getBranchId()));

        Pageable pageable = createPageable(searchRequest);

        Page<Product> productPage = productRepository.searchProductsByBranch(
                searchRequest.getBranchId(),
                searchRequest.getKeyword(),
                searchRequest.getProductType(),
                searchRequest.getIsActive(),
                searchRequest.getMinPrice(),
                searchRequest.getMaxPrice(),
                pageable);

        List<BranchProduct> branchProducts = branchProductRepository
                .findByKeyBranchProductBranchId(searchRequest.getBranchId());

        Map<Integer, Integer> productQuantityMap = new HashMap<>();
        for (BranchProduct bp : branchProducts) {
            productQuantityMap.put(bp.getProduct().getId(), bp.getQuantity());
        }

        List<ProductSearchDTO> productDTOs = productPage.getContent().stream()
                .map(product -> mapToProductSearchDTO(product, productQuantityMap))
                .collect(Collectors.toList());

        return createPagedResponse(productPage, productDTOs);
    }

    private Pageable createPageable(ProductSearchRequest searchRequest) {
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

        Sort sort = Sort.by(Sort.Direction.fromString(
                searchRequest.getSortDirection() != null ? searchRequest.getSortDirection() : "ASC"),
                sortBy);

        return PageRequest.of(page, size, sort);
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isEmpty()) {
            return "name";
        }

        return switch (sortBy.toLowerCase()) {
            case "name", "productname" -> "name";
            case "price", "productprice" -> "price";
            case "createddate", "createdate" -> "createdDate";
            case "producttype", "type" -> "productType.name";
            default -> "name";
        };
    }

    private ProductSearchDTO mapToProductSearchDTO(Product product, Map<Integer, Integer> quantityMap) {
        return ProductSearchDTO.builder()
                .productId(product.getId())
                .productName(product.getName())
                .productDescription(product.getDescription())
                .productImage(product.getImage())
                .productPrice(product.getPrice())
                .productType(product.getProductType() != null ? product.getProductType().getName() : null)
                .productTypeId(product.getProductType() != null ? product.getProductType().getId() : 0)
                .isActive(product.isActive())
                .quantityInBranch(quantityMap.getOrDefault(product.getId(), 0))
                .createdDate(product.getCreatedDate())
                .updatedDate(product.getUpdateDate())
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
