package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ProductTypeDTO;

import java.util.List;

public interface ProductTypeService {
    List<ProductTypeDTO> getAllProductTypes();

    ProductTypeDTO getProductTypeById(int id);

    ProductTypeDTO createProductType(ProductTypeDTO productTypeDTO);

    ProductTypeDTO updateProductType(int id, ProductTypeDTO productTypeDTO);


}
