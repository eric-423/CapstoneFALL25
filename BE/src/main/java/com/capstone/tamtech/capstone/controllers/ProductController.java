package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.ProductSearchDTO;
import com.capstone.tamtech.capstone.payload.PagedResponse;
import com.capstone.tamtech.capstone.payload.request.ProductSearchRequest;
import com.capstone.tamtech.capstone.services.impl.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@Tag(name = "Product Management", description = "API quản lý sản phẩm")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Operation(summary = "Tìm kiếm sản phẩm theo chi nhánh", description = """
            **Endpoint toàn năng** để tìm kiếm, lọc, sắp xếp và phân trang danh sách sản phẩm theo chi nhánh.

            **Tính năng:**
            - ✅ Lọc theo chi nhánh (bắt buộc)
            - ✅ Tìm kiếm theo từ khóa (tên, mô tả sản phẩm)
            - ✅ Lọc theo loại sản phẩm
            - ✅ Lọc theo trạng thái (đang bán/ngừng bán)
            - ✅ Lọc theo khoảng giá (min-max)
            - ✅ Sắp xếp theo nhiều tiêu chí (tên, giá, ngày tạo, loại)
            - ✅ Phân trang linh hoạt

            **Ví dụ sử dụng:**
            1. Lấy tất cả sản phẩm của chi nhánh 1: `?branchId=1`
            2. Tìm "phở" tại chi nhánh 1: `?branchId=1&keyword=phở`
            3. Lọc theo giá 50k-100k: `?branchId=1&minPrice=50000&maxPrice=100000`
            4. Sắp xếp theo giá giảm dần: `?branchId=1&sortBy=price&sortDirection=DESC`
            5. Kết hợp: `?branchId=1&keyword=cơm&productType=Món chính&sortBy=price&sortDirection=ASC&page=0&size=20`
            """)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tìm kiếm thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = PagedResponse.class), examples = @ExampleObject(value = """
                    {
                      "content": [
                        {
                          "productId": 1,
                          "productName": "Phở Bò Tái",
                          "productDescription": "Phở bò tái đặc biệt",
                          "productImage": "https://example.com/pho.jpg",
                          "productPrice": 55000,
                          "productType": "Món chính",
                          "productTypeId": 1,
                          "isActive": true,
                          "quantityInBranch": 50,
                          "createdDate": "2024-01-01T10:30:00",
                          "updatedDate": "2024-01-15T14:20:00"
                        }
                      ],
                      "pageNumber": 0,
                      "pageSize": 10,
                      "totalElements": 25,
                      "totalPages": 3,
                      "last": false,
                      "first": true,
                      "empty": false
                    }
                    """))),
            @ApiResponse(responseCode = "400", description = "Tham số không hợp lệ (thiếu branchId hoặc giá trị không đúng)"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy chi nhánh với ID được cung cấp")
    })
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<ProductSearchDTO>> searchProducts(
            @Parameter(description = "ID chi nhánh (bắt buộc)", required = true, example = "1") @RequestParam(required = true) Integer branchId,

            @Parameter(description = "Từ khóa tìm kiếm (tìm trong tên và mô tả sản phẩm)", example = "phở") @RequestParam(required = false) String keyword,

            @Parameter(description = "Loại sản phẩm", example = "Món chính") @RequestParam(required = false) String productType,

            @Parameter(description = "Trạng thái sản phẩm (true: đang bán, false: ngừng bán)", example = "true") @RequestParam(required = false) Boolean isActive,

            @Parameter(description = "Giá tối thiểu", example = "0") @RequestParam(required = false) Double minPrice,

            @Parameter(description = "Giá tối đa", example = "500000") @RequestParam(required = false) Double maxPrice,

            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0") @RequestParam(required = false, defaultValue = "0") Integer page,

            @Parameter(description = "Số lượng sản phẩm mỗi trang (tối đa 100)", example = "10") @RequestParam(required = false, defaultValue = "10") Integer size,

            @Parameter(description = "Trường sắp xếp", example = "name", schema = @Schema(allowableValues = { "name",
                    "price", "createdDate",
                    "productType" })) @RequestParam(required = false, defaultValue = "name") String sortBy,

            @Parameter(description = "Hướng sắp xếp", example = "ASC", schema = @Schema(allowableValues = { "ASC",
                    "DESC" })) @RequestParam(required = false, defaultValue = "ASC") String sortDirection) {
        ProductSearchRequest searchRequest = new ProductSearchRequest();
        searchRequest.setBranchId(branchId);
        searchRequest.setKeyword(keyword);
        searchRequest.setProductType(productType);
        searchRequest.setIsActive(isActive);
        searchRequest.setMinPrice(minPrice);
        searchRequest.setMaxPrice(maxPrice);
        searchRequest.setPage(page);
        searchRequest.setSize(size);
        searchRequest.setSortBy(sortBy);
        searchRequest.setSortDirection(sortDirection);

        PagedResponse<ProductSearchDTO> response = productService.searchProducts(searchRequest);
        return ResponseEntity.ok(response);
    }
}
