package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ProductTypeDTO;
import com.capstone.tamtech.capstone.payload.request.ProductTypeRequest;

import java.util.List;

public interface ProductTypeService {
    List<ProductTypeDTO> getAllProductTypes();

    ProductTypeDTO getProductTypeById(int id);

    ProductTypeDTO createProductType(ProductTypeRequest productTypeRequest);

    ProductTypeDTO updateProductType(int id, ProductTypeDTO productTypeDTO);


}
