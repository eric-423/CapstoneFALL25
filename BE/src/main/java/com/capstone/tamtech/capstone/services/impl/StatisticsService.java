package com.capstone.tamtech.capstone.services.impl;

import com.capstone.tamtech.capstone.dto.*;

import java.util.Date;

public interface StatisticsService {

    RevenueStatisticsDTO getRevenueByDate(Integer branchId, Date date);

    OrderCountStatisticsDTO getOrderCountByDate(Integer branchId, Date date);

    NewCustomerStatisticsDTO getNewCustomerStatistics(String comparisonType);

    ServiceTimeStatisticsDTO getAverageServiceTime(Integer branchId, Date date, String comparisonType);

    Revenue7DaysDTO getRevenue7Days(Integer branchId);

    TopMaterialDTO getTopMaterials(Integer branchId, Integer limit);

    MaterialUsageDTO getMaterialUsageByName(String materialName);

    TopSellingItemDTO getTopSellingItems(Integer branchId, Integer limit);

    ItemSalesDTO getItemSalesByName(String itemName);
}
