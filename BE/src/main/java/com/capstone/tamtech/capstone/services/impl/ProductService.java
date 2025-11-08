package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.ProductDTO;
import com.capstone.tamtech.capstone.dto.ProductSearchDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ProductCreateRequest;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;

public interface ProductService {

    /**
     * Tìm kiếm sản phẩm theo chi nhánh với các tiêu chí lọc, phân trang và sắp xếp
     *
     * @param searchRequest Tiêu chí tìm kiếm
     * @return Danh sách sản phẩm được phân trang
     */
    PagedResponse<ProductSearchDTO> searchProducts(ProductSearchRequest searchRequest);

    ProductDTO createProduct(ProductCreateRequest productCreateRequest);

    ProductDTO updateProduct(int id,ProductCreateRequest productCreateRequest);
}
