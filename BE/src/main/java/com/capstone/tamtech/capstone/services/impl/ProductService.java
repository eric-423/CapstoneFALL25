package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ProductDTO;
import com.capstone.tamtech.capstone.dto.ProductSearchDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ProductCreateRequest;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;

public interface ProductService {

    PagedResponse<ProductSearchDTO> searchProducts(ProductSearchRequest searchRequest);

    ProductDTO createProduct(ProductCreateRequest productCreateRequest);

    ProductDTO updateProduct(int id,ProductCreateRequest productCreateRequest);

    PagedResponse<ProductDTO> searchProductForAllBranch(ProductSearchRequest searchRequest);

    ProductDTO getProductById(Integer productId);
}
