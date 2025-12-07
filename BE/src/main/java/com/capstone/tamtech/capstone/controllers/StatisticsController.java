package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.services.impl.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/statistics")
@CrossOrigin(origins = "*")
@Tag(name = "Statistics", description = "API thống kê doanh thu, đơn hàng, khách hàng")
public class StatisticsController {

        @Autowired
        private StatisticsService statisticsService;

        @Operation(summary = "Thống kê doanh thu theo ngày", description = """
                        Lấy doanh thu theo ngày của 1 chi nhánh.

                        - Nếu không truyền date → Lấy doanh thu HÔM NAY
                        - Chỉ tính các đơn hàng ĐÃ THANH TOÁN (paymentTime != null)

                        **Ví dụ:**
                        - Hôm nay: `?branchId=1`
                        - Ngày cụ thể: `?branchId=1&date=2024-11-10`
                        """)
        @GetMapping("/revenue")
        public ResponseEntity<?> getRevenueByDate(
                        @Parameter(description = "ID chi nhánh", required = true, example = "1") @RequestParam Integer branchId,

                        @Parameter(description = "Ngày cần lấy (yyyy-MM-dd). Không truyền = hôm nay", example = "2024-11-10") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
                RevenueStatisticsDTO result = statisticsService.getRevenueByDate(branchId, date);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        @Operation(summary = "Thống kê số lượng đơn hàng theo ngày", description = """
                        Lấy số lượng đơn hàng theo ngày của 1 chi nhánh.

                        - Nếu không truyền date → Lấy đơn hàng HÔM NAY
                        - Phân loại theo: Shipping, Pickup, Dining

                        **Ví dụ:**
                        - Hôm nay: `?branchId=1`
                        - Ngày cụ thể: `?branchId=1&date=2024-11-10`
                        """)
        @GetMapping("/order-count")
        public ResponseEntity<?> getOrderCountByDate(
                        @Parameter(description = "ID chi nhánh", required = true, example = "1") @RequestParam Integer branchId,

                        @Parameter(description = "Ngày cần lấy (yyyy-MM-dd). Không truyền = hôm nay", example = "2024-11-10") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
                OrderCountStatisticsDTO result = statisticsService.getOrderCountByDate(branchId, date);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        @Operation(summary = "Thống kê khách hàng mới", description = """
                        So sánh số lượng khách hàng mới với kỳ trước.

                        **ComparisonType:**
                        - `DAILY` → So sánh hôm nay với hôm qua
                        - `MONTHLY` → So sánh tháng này với tháng trước

                        **Kết quả:**
                        - Số khách mới hôm nay/tháng này
                        - Số khách mới kỳ trước
                        - Chênh lệch
                        - % thay đổi

                        **Ví dụ:**
                        - So sánh theo ngày: `?comparisonType=DAILY`
                        - So sánh theo tháng: `?comparisonType=MONTHLY`
                        """)
        @GetMapping("/new-customers")
        public ResponseEntity<?> getNewCustomerStatistics(
                        @Parameter(description = "Loại so sánh: DAILY (với hôm qua) hoặc MONTHLY (với tháng trước)", example = "DAILY") @RequestParam(required = false, defaultValue = "DAILY") String comparisonType) {
                NewCustomerStatisticsDTO result = statisticsService.getNewCustomerStatistics(comparisonType);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        @Operation(summary = "Thống kê thời gian phục vụ trung bình", description = """
                        Tính thời gian phục vụ trung bình (từ khi tạo order đến khi hoàn thành) của 1 chi nhánh.

                        **Thời gian hoàn thành:**
                        - Pickup order: pickupTime
                        - Shipping order: deliveryAtt
                        - Dining order: paymentTime

                        **ComparisonType:**
                        - `DAILY` → So sánh với hôm qua
                        - `MONTHLY` → So sánh với tháng trước

                        **Kết quả:**
                        - Thời gian trung bình (phút)
                        - Số đơn hàng đã xử lý
                        - Chênh lệch so với kỳ trước
                        - % thay đổi

                        **Ví dụ:**
                        - Hôm nay vs hôm qua: `?branchId=1&comparisonType=DAILY`
                        - Ngày cụ thể vs tháng trước: `?branchId=1&date=2024-11-10&comparisonType=MONTHLY`
                        """)
        @GetMapping("/service-time")
        public ResponseEntity<?> getAverageServiceTime(
                        @Parameter(description = "ID chi nhánh", required = true, example = "1") @RequestParam Integer branchId,

                        @Parameter(description = "Ngày cần lấy (yyyy-MM-dd). Không truyền = hôm nay", example = "2024-11-10") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,

                        @Parameter(description = "Loại so sánh: DAILY (với hôm qua) hoặc MONTHLY (với tháng trước)", example = "DAILY") @RequestParam(required = false, defaultValue = "DAILY") String comparisonType) {
                ServiceTimeStatisticsDTO result = statisticsService.getAverageServiceTime(branchId, date,
                                comparisonType);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        @Operation(summary = "Doanh thu 7 ngày gần nhất", description = """
                        Lấy doanh thu 7 ngày gần nhất của chi nhánh hoặc toàn bộ cửa hàng.

                        - Không truyền branchId → Toàn bộ cửa hàng
                        - Truyền branchId → Chỉ chi nhánh đó

                        **Ví dụ:**
                        - Toàn bộ: `/revenue-7days`
                        - Chi nhánh 1: `/revenue-7days?branchId=1`
                        """)
        @GetMapping("/revenue-7days")
        public ResponseEntity<?> getRevenue7Days(
                        @Parameter(description = "ID chi nhánh (không truyền = toàn bộ)", example = "1") @RequestParam(required = false) Integer branchId) {
                Revenue7DaysDTO result = statisticsService.getRevenue7Days(branchId);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        @Operation(summary = "Top nguyên liệu sử dụng nhiều nhất", description = """
                        Lấy danh sách nguyên liệu được sử dụng nhiều nhất.

                        - Không truyền branchId → Toàn bộ cửa hàng
                        - Truyền branchId → Chỉ chi nhánh đó
                        - limit mặc định = 5

                        **Ví dụ:**
                        - Top 5 toàn bộ: `/top-materials`
                        - Top 10 chi nhánh 1: `/top-materials?branchId=1&limit=10`
                        """)
        @GetMapping("/top-materials")
        public ResponseEntity<?> getTopMaterials(
                        @Parameter(description = "ID chi nhánh (không truyền = toàn bộ)", example = "1") @RequestParam(required = false) Integer branchId,

                        @Parameter(description = "Số lượng top (mặc định 5)", example = "5") @RequestParam(required = false, defaultValue = "5") Integer limit) {
                TopMaterialDTO result = statisticsService.getTopMaterials(branchId, limit);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        @Operation(summary = "Số lượng sử dụng của 1 nguyên liệu", description = """
                        Tìm kiếm và xem số lượng sử dụng của 1 nguyên liệu cụ thể.

                        Tìm kiếm theo tên (không phân biệt hoa thường).

                        **Ví dụ:**
                        - Tìm "Thịt heo": `/material-usage?materialName=thịt heo`
                        """)
        @GetMapping("/material-usage")
        public ResponseEntity<?> getMaterialUsage(
                        @Parameter(description = "Tên nguyên liệu cần tìm", required = true, example = "Thịt heo") @RequestParam String materialName) {
                MaterialUsageDTO result = statisticsService.getMaterialUsageByName(materialName);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        @Operation(summary = "Top món ăn bán chạy nhất (PUBLIC)", description = """
                        Lấy danh sách món ăn (product + combo) bán chạy nhất.

                        **Dành cho khách hàng xem món bán chạy!**

                        - Không truyền branchId → Toàn bộ cửa hàng
                        - Truyền branchId → Chỉ chi nhánh đó
                        - limit mặc định = 5

                        **Ví dụ:**
                        - Top 5 toàn bộ: `/top-selling`
                        - Top 10 chi nhánh 1: `/top-selling?branchId=1&limit=10`
                        """)
        @GetMapping("/top-selling")
        public ResponseEntity<?> getTopSellingItems(
                        @Parameter(description = "ID chi nhánh (không truyền = toàn bộ)", example = "1") @RequestParam(required = false) Integer branchId,

                        @Parameter(description = "Số lượng top (mặc định 5)", example = "5") @RequestParam(required = false, defaultValue = "5") Integer limit) {
                TopSellingItemDTO result = statisticsService.getTopSellingItems(branchId, limit);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        @Operation(summary = "Số lượng bán ra của 1 món ăn (PUBLIC)", description = """
                        Tìm kiếm và xem số lượng bán ra của 1 món ăn cụ thể (product hoặc combo).

                        **Dành cho khách hàng xem độ phổ biến của món!**

                        Tìm kiếm theo tên (không phân biệt hoa thường).

                        **Ví dụ:**
                        - Tìm "Cơm tấm": `/item-sales?itemName=cơm tấm`
                        - Tìm "Combo gia đình": `/item-sales?itemName=combo gia đình`
                        """)
        @GetMapping("/item-sales")
        public ResponseEntity<?> getItemSales(
                        @Parameter(description = "Tên món ăn cần tìm", required = true, example = "Cơm tấm sườn nướng") @RequestParam String itemName) {
                ItemSalesDTO result = statisticsService.getItemSalesByName(itemName);

                ResponseData responseData = new ResponseData();
                responseData.setData(result);
                responseData.setStatus(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
}
