package com.capstone.tamtech.capstone.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Cấu trúc phản hồi chuẩn từ API")
public class ResponseData {

    @Schema(description = "Mã trạng thái HTTP", example = "200")
    private int status;

    @Schema(description = "Mô tả kết quả", example = "Thao tác thành công")
    private String desc;

    @Schema(description = "Dữ liệu trả về (có thể là object, array, string, number, boolean)")
    private Object data;
}
