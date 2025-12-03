package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.*;

import java.util.Date;
import java.util.List;

public interface DashboardService {

    List<DashboardKPIDTO> getKPIs(Integer branchId, Date fromDate, Date toDate);

    List<RevenueChartDTO> getRevenueChart(Integer branchId, Date fromDate, Date toDate, String groupBy);

    List<RevenueByChannelDTO> getRevenueByChannel(Integer branchId, Date fromDate, Date toDate);

    List<PeakHoursDTO> getPeakHours(Integer branchId, Date fromDate, Date toDate);

    List<TopSellingProductDTO> getTopSellingProducts(Integer branchId, Date fromDate, Date toDate, Integer limit);

    List<ProductPerformanceDTO> getProductPerformance(Integer branchId, Date fromDate, Date toDate);

    List<ComboEffectivenessDTO> getComboEffectiveness(Integer branchId, Date fromDate, Date toDate);

    List<PromotionEffectivenessDTO> getPromotionEffectiveness(Integer branchId, Date fromDate, Date toDate);

    List<VoucherRevenueDTO> getVoucherRevenue(Integer branchId, Date fromDate, Date toDate);

    List<KitchenPerformanceDTO> getKitchenPerformance(Integer branchId, Date fromDate, Date toDate);

    List<StaffPerformanceDTO> getStaffPerformance(Integer branchId, Date fromDate, Date toDate);

    List<OrderFlowDTO> getOrderFlow(Integer branchId, Date fromDate, Date toDate);
}
