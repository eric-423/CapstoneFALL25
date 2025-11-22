package com.capstone.tamtech.capstone.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kết quả phân trang")
public class PagedResponse<T> {

    @Schema(description = "Danh sách dữ liệu")
    private List<T> content;

    @Schema(description = "Số trang hiện tại", example = "0")
    private int pageNumber;

    @Schema(description = "Số lượng phần tử mỗi trang", example = "10")
    private int pageSize;

    @Schema(description = "Tổng số phần tử", example = "100")
    private long totalElements;

    @Schema(description = "Tổng số trang", example = "10")
    private int totalPages;

    @Schema(description = "Có phải trang cuối cùng không", example = "false")
    private boolean last;

    @Schema(description = "Có phải trang đầu tiên không", example = "true")
    private boolean first;

    @Schema(description = "Trang hiện tại có dữ liệu không", example = "false")
    private boolean empty;
}
