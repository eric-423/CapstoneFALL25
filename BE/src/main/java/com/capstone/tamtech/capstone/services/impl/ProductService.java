package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ProductDTO;
import com.capstone.tamtech.capstone.dto.ProductSearchDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ProductCreateRequest;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;

import java.util.List;

public interface ProductService {

    PagedResponse<ProductSearchDTO> searchProducts(ProductSearchRequest searchRequest);

    ProductDTO createProduct(ProductCreateRequest productCreateRequest);

    ProductDTO updateProduct(int id,ProductCreateRequest productCreateRequest);

    PagedResponse<ProductDTO> searchProductForAllBranch(ProductSearchRequest searchRequest);

    ProductSearchDTO getProductById(Integer productId, Integer branchId);

    List<ProductSearchDTO> getPairedProducts(Integer productId, Integer branchId);

    List<ProductDTO> updatePairedProducts(Integer productId, List<Integer> pairedProductIds);
}
