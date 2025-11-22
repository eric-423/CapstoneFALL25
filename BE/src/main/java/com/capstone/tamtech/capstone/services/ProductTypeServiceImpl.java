package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.ProductTypeDTO;
import com.capstone.tamtech.capstone.entities.ProductType;
import com.capstone.tamtech.capstone.payload.request.ProductTypeRequest;
import com.capstone.tamtech.capstone.repositories.ProductTypeRepository;
import com.capstone.tamtech.capstone.services.impl.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductTypeServiceImpl implements ProductTypeService {

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Override
    public List<ProductTypeDTO> getAllProductTypes() {
        List<ProductType> productTypes = productTypeRepository.findAll();
        if (!productTypes.isEmpty()) {
            return productTypes.stream()
                    .map(this::toDTO)
                    .toList();
        }
        return null;
    }

    private ProductTypeDTO toDTO(ProductType productType) {
        ProductTypeDTO dto = new ProductTypeDTO();
        dto.setId(productType.getId());
        dto.setName(productType.getName());
        dto.setImageUrl(productType.getImageUrl());
        return dto;
    }

    @Override
    public ProductTypeDTO getProductTypeById(int id) {

        return toDTO(productTypeRepository.findById(id).orElse(null));
    }

    @Override
    public ProductTypeDTO createProductType(ProductTypeRequest productTypeRequest) {
        ProductType productType = new ProductType();
        productType.setName(productTypeRequest.getName());
        productType.setImageUrl(productTypeRequest.getImageUrl());
        productType = productTypeRepository.save(productType);

        return toDTO(productType);
    }

    @Override
    public ProductTypeDTO updateProductType(int id, ProductTypeDTO productTypeDTO) {
        ProductType existingProductType = productTypeRepository.findById(id).orElse(null);
        if (existingProductType != null) {
            existingProductType.setName(productTypeDTO.getName());
            existingProductType = productTypeRepository.save(existingProductType);
            return toDTO(existingProductType);
        }
        return null;
    }
}
