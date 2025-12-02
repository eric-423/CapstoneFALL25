package com.capstone.tamtech.capstone.controllers;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.payload.ResponseData;
import com.capstone.tamtech.capstone.services.impl.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
@Tag(name = "Dashboard Admin", description = "API Dashboard Admin dạng Tab")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Operation(summary = "Lấy Chỉ Số Kinh Doanh (KPI)", description = "Lấy 4 chỉ số quan trọng nhất: Doanh thu, Đơn hàng, Khách mới, Giá trị đơn TB")
    @GetMapping("/overview/kpi")
    public ResponseEntity<?> getKPIs(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<DashboardKPIDTO> result = dashboardService.getKPIs(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("KPI data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Biểu Đồ Doanh Thu", description = "Dữ liệu vẽ biểu đồ vùng (Area Chart) theo thời gian")
    @GetMapping("/overview/revenue-chart")
    public ResponseEntity<?> getRevenueChart(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate,

            @Parameter(description = "Nhóm theo: day/week/month (mặc định: day)", example = "day") @RequestParam(required = false, defaultValue = "day") String groupBy) {

        List<RevenueChartDTO> result = dashboardService.getRevenueChart(branchId, fromDate, toDate, groupBy);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Revenue chart data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Doanh Thu Theo Nguồn", description = "Phân bổ doanh thu theo kênh bán hàng")
    @GetMapping("/overview/revenue-by-channel")
    public ResponseEntity<?> getRevenueByChannel(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<RevenueByChannelDTO> result = dashboardService.getRevenueByChannel(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Revenue by channel data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Khung Giờ Vàng", description = "Lượng đơn hàng trung bình theo giờ")
    @GetMapping("/overview/peak-hours")
    public ResponseEntity<?> getPeakHours(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<PeakHoursDTO> result = dashboardService.getPeakHours(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Peak hours data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Top Món Bán Chạy", description = "Danh sách món ăn có doanh thu/số lượng bán cao nhất")
    @GetMapping("/products/top-selling")
    public ResponseEntity<?> getTopSellingProducts(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate,

            @Parameter(description = "Số lượng top (mặc định: 10)", example = "10") @RequestParam(required = false, defaultValue = "10") Integer limit) {

        List<TopSellingProductDTO> result = dashboardService.getTopSellingProducts(branchId, fromDate, toDate, limit);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Top selling products data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Hiệu Suất Sản Phẩm (Scatter Chart)", description = "Dữ liệu tương quan giữa số lượng bán và doanh thu của từng món")
    @GetMapping("/products/performance")
    public ResponseEntity<?> getProductPerformance(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<ProductPerformanceDTO> result = dashboardService.getProductPerformance(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Product performance data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Hiệu Quả Combo", description = "So sánh số lượng bán và doanh thu của các Combo")
    @GetMapping("/products/combo-effectiveness")
    public ResponseEntity<?> getComboEffectiveness(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<ComboEffectivenessDTO> result = dashboardService.getComboEffectiveness(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Combo effectiveness data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Hiệu Quả Khuyến Mãi", description = "Doanh thu tạo ra từ các mã giảm giá")
    @GetMapping("/marketing/promotions")
    public ResponseEntity<?> getPromotionEffectiveness(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<PromotionEffectivenessDTO> result = dashboardService.getPromotionEffectiveness(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Promotion effectiveness data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Doanh Thu Voucher", description = "Tỷ trọng doanh thu theo loại Voucher")
    @GetMapping("/marketing/vouchers")
    public ResponseEntity<?> getVoucherRevenue(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<VoucherRevenueDTO> result = dashboardService.getVoucherRevenue(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Voucher revenue data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Hiệu Suất Bếp", description = "Thời gian chế biến trung bình theo khung giờ")
    @GetMapping("/operations/kitchen-performance")
    public ResponseEntity<?> getKitchenPerformance(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<KitchenPerformanceDTO> result = dashboardService.getKitchenPerformance(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Kitchen performance data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Hiệu Suất Nhân Viên", description = "Số lượng đơn hàng xử lý bởi từng nhân viên")
    @GetMapping("/operations/staff-performance")
    public ResponseEntity<?> getStaffPerformance(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<StaffPerformanceDTO> result = dashboardService.getStaffPerformance(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Staff performance data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @Operation(summary = "Quy Trình Đơn Hàng", description = "Thời gian trung bình tại mỗi bước của đơn hàng")
    @GetMapping("/operations/order-flow")
    public ResponseEntity<?> getOrderFlow(
            @Parameter(description = "ID chi nhánh (không truyền = toàn hệ thống)", example = "1") @RequestParam(required = false) Integer branchId,

            @Parameter(description = "Ngày bắt đầu (YYYY-MM-DD)", example = "2024-11-01") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,

            @Parameter(description = "Ngày kết thúc (YYYY-MM-DD)", example = "2024-11-30") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate) {

        List<OrderFlowDTO> result = dashboardService.getOrderFlow(branchId, fromDate, toDate);

        ResponseData responseData = new ResponseData();
        responseData.setData(result);
        responseData.setStatus(200);
        responseData.setDesc("Order flow data retrieved successfully");

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
