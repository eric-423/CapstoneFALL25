package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.repositories.*;
import com.capstone.tamtech.capstone.services.impl.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public RevenueStatisticsDTO getRevenueByDate(Integer branchId, Date date) {
        Date targetDate = date != null ? date : new Date();

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi nhánh với ID: " + branchId));

        Calendar cal = Calendar.getInstance();
        cal.setTime(targetDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date startOfDay = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        Date endOfDay = cal.getTime();

        List<Order> allOrders = orderRepository.findAll();

        double totalRevenue = 0.0;
        int orderCount = 0;

        for (Order order : allOrders) {
            if (order.getBranch() != null && order.getBranch().getId() == branchId) {
                Date orderDate = order.getCreatedAt();
                if (orderDate != null && !orderDate.before(startOfDay) && !orderDate.after(endOfDay)) {
                    if (order.getPaymentTime() != null) {
                        totalRevenue += order.getAmount();
                        orderCount++;
                    }
                }
            }
        }

        return RevenueStatisticsDTO.builder()
                .date(targetDate)
                .branchId(branchId)
                .branchName(branch.getName())
                .totalRevenue(totalRevenue)
                .totalOrders(orderCount)
                .message("Doanh thu ngày " + targetDate)
                .build();
    }

    @Override
    public OrderCountStatisticsDTO getOrderCountByDate(Integer branchId, Date date) {
        Date targetDate = date != null ? date : new Date();

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi nhánh với ID: " + branchId));

        Calendar cal = Calendar.getInstance();
        cal.setTime(targetDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date startOfDay = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        Date endOfDay = cal.getTime();

        List<Order> allOrders = orderRepository.findAll();

        int totalOrders = 0;
        int shippingOrders = 0;
        int pickupOrders = 0;
        int diningOrders = 0;

        for (Order order : allOrders) {
            if (order.getBranch() != null && order.getBranch().getId() == branchId) {

                Date orderDate = order.getCreatedAt();
                if (orderDate != null && !orderDate.before(startOfDay) && !orderDate.after(endOfDay)) {
                    totalOrders++;

                    if (order.isPickUp()) {
                        pickupOrders++;
                    } else if (Boolean.TRUE.equals(order.getIsTable())) {
                        diningOrders++;
                    } else {
                        shippingOrders++;
                    }
                }
            }
        }

        return OrderCountStatisticsDTO.builder()
                .date(targetDate)
                .branchId(branchId)
                .branchName(branch.getName())
                .totalOrders(totalOrders)
                .shippingOrders(shippingOrders)
                .pickupOrders(pickupOrders)
                .diningOrders(diningOrders)
                .message("Số lượng đơn hàng ngày " + targetDate)
                .build();
    }

    @Override
    public NewCustomerStatisticsDTO getNewCustomerStatistics(String comparisonType) {
        Date now = new Date();
        Date comparisonDate;

        Calendar cal = Calendar.getInstance();
        cal.setTime(now);

        if ("MONTHLY".equalsIgnoreCase(comparisonType)) {
            cal.add(Calendar.MONTH, -1);
            comparisonDate = cal.getTime();
        } else {
            comparisonType = "DAILY";
            cal.add(Calendar.DATE, -1);
            comparisonDate = cal.getTime();
        }

        cal.setTime(now);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date startOfToday = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date endOfToday = cal.getTime();

        cal.setTime(comparisonDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date startOfComparison = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date endOfComparison = cal.getTime();

        List<Users> allUsers = usersRepository.findAll();

        int newCustomersToday = 0;
        int newCustomersComparison = 0;

        for (Users user : allUsers) {
            if (user.getEmail() != null && !user.getEmail().contains("@comtam.com")) {
                Date createdAt = user.getCreatedAt();
                if (createdAt != null) {
                    if (!createdAt.before(startOfToday) && !createdAt.after(endOfToday)) {
                        newCustomersToday++;
                    }

                    if (!createdAt.before(startOfComparison) && !createdAt.after(endOfComparison)) {
                        newCustomersComparison++;
                    }
                }
            }
        }

        int difference = newCustomersToday - newCustomersComparison;
        double percentageChange = 0.0;
        if (newCustomersComparison > 0) {
            percentageChange = ((double) difference / newCustomersComparison) * 100.0;
        } else if (newCustomersToday > 0) {
            percentageChange = 100.0;
        }

        String comparisonLabel = "DAILY".equalsIgnoreCase(comparisonType) ? "hôm qua" : "tháng trước";

        return NewCustomerStatisticsDTO.builder()
                .currentDate(now)
                .comparisonDate(comparisonDate)
                .newCustomersToday(newCustomersToday)
                .newCustomersComparison(newCustomersComparison)
                .difference(difference)
                .percentageChange(percentageChange)
                .comparisonType(comparisonType)
                .message("So sánh với " + comparisonLabel)
                .build();
    }

    @Override
    public ServiceTimeStatisticsDTO getAverageServiceTime(Integer branchId, Date date, String comparisonType) {
        Date targetDate = date != null ? date : new Date();

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi nhánh với ID: " + branchId));

        Calendar cal = Calendar.getInstance();
        cal.setTime(targetDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date startOfDay = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date endOfDay = cal.getTime();

        Date comparisonDate;
        if ("MONTHLY".equalsIgnoreCase(comparisonType)) {
            cal.setTime(targetDate);
            cal.add(Calendar.MONTH, -1);
            comparisonDate = cal.getTime();
        } else {
            comparisonType = "DAILY";
            cal.setTime(targetDate);
            cal.add(Calendar.DATE, -1);
            comparisonDate = cal.getTime();
        }

        cal.setTime(comparisonDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Date startOfComparison = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date endOfComparison = cal.getTime();

        List<Order> allOrders = orderRepository.findAll();

        long totalServiceTimeMs = 0;
        int orderCount = 0;

        long comparisonTotalServiceTimeMs = 0;
        int comparisonOrderCount = 0;

        for (Order order : allOrders) {
            if (order.getBranch() != null && order.getBranch().getId() == branchId) {
                Date createdAt = order.getCreatedAt();
                Date completedAt = null;

                if (order.getPickupTime() != null) {
                    completedAt = order.getPickupTime();
                } else if (order.getDeliveryAtt() != null) {
                    completedAt = order.getDeliveryAtt();
                } else if (order.getPaymentTime() != null && Boolean.TRUE.equals(order.getIsTable())) {
                    completedAt = order.getPaymentTime();
                }

                if (createdAt != null && completedAt != null) {
                    long serviceTimeMs = completedAt.getTime() - createdAt.getTime();

                    if (!createdAt.before(startOfDay) && !createdAt.after(endOfDay)) {
                        totalServiceTimeMs += serviceTimeMs;
                        orderCount++;
                    }

                    if (!createdAt.before(startOfComparison) && !createdAt.after(endOfComparison)) {
                        comparisonTotalServiceTimeMs += serviceTimeMs;
                        comparisonOrderCount++;
                    }
                }
            }
        }

        double avgServiceTimeMinutes = 0.0;
        if (orderCount > 0) {
            avgServiceTimeMinutes = (double) totalServiceTimeMs / orderCount / 1000.0 / 60.0;
        }

        double comparisonAvgServiceTimeMinutes = 0.0;
        if (comparisonOrderCount > 0) {
            comparisonAvgServiceTimeMinutes = (double) comparisonTotalServiceTimeMs / comparisonOrderCount / 1000.0
                    / 60.0;
        }

        double differenceMinutes = avgServiceTimeMinutes - comparisonAvgServiceTimeMinutes;

        double percentageChange = 0.0;
        if (comparisonAvgServiceTimeMinutes > 0) {
            percentageChange = (differenceMinutes / comparisonAvgServiceTimeMinutes) * 100.0;
        }

        String comparisonLabel = "DAILY".equalsIgnoreCase(comparisonType) ? "hôm qua" : "tháng trước";

        return ServiceTimeStatisticsDTO.builder()
                .currentDate(targetDate)
                .comparisonDate(comparisonDate)
                .averageServiceTimeMinutes(Math.round(avgServiceTimeMinutes * 100.0) / 100.0)
                .comparisonAverageServiceTimeMinutes(Math.round(comparisonAvgServiceTimeMinutes * 100.0) / 100.0)
                .differenceMinutes(Math.round(differenceMinutes * 100.0) / 100.0)
                .percentageChange(Math.round(percentageChange * 100.0) / 100.0)
                .totalOrdersProcessed(orderCount)
                .comparisonOrdersProcessed(comparisonOrderCount)
                .comparisonType(comparisonType)
                .message("Thời gian phục vụ trung bình so với " + comparisonLabel)
                .build();
    }

    @Override
    public Revenue7DaysDTO getRevenue7Days(Integer branchId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List<Revenue7DaysDTO.DailyRevenue> dailyRevenues = new ArrayList<>();

        String branchName = "";
        if (branchId != null) {
            Branch branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi nhánh với ID: " + branchId));
            branchName = branch.getName();
        }

        double totalRevenue = 0.0;

        for (int i = 6; i >= 0; i--) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DATE, -i);
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            Date startOfDay = cal.getTime();

            cal.set(Calendar.HOUR_OF_DAY, 23);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            Date endOfDay = cal.getTime();

            List<Order> allOrders = orderRepository.findAll();
            double dayRevenue = 0.0;
            int dayOrderCount = 0;

            for (Order order : allOrders) {
                boolean matchBranch = branchId == null ||
                        (order.getBranch() != null && order.getBranch().getId() == branchId.intValue());

                if (matchBranch && order.getCreatedAt() != null) {
                    if (!order.getCreatedAt().before(startOfDay) && !order.getCreatedAt().after(endOfDay)) {
                        if (order.getPaymentTime() != null) {
                            dayRevenue += order.getAmount();
                            dayOrderCount++;
                        }
                    }
                }
            }

            dailyRevenues.add(Revenue7DaysDTO.DailyRevenue.builder()
                    .date(sdf.format(startOfDay))
                    .revenue(dayRevenue)
                    .orderCount(dayOrderCount)
                    .build());

            totalRevenue += dayRevenue;
        }

        double avgRevenue = totalRevenue / 7.0;

        return Revenue7DaysDTO.builder()
                .branchId(branchId)
                .branchName(branchName)
                .dailyRevenues(dailyRevenues)
                .totalRevenue(totalRevenue)
                .averageRevenue(Math.round(avgRevenue * 100.0) / 100.0)
                .message("Doanh thu 7 ngày gần nhất")
                .build();
    }

    @Override
    public TopMaterialDTO getTopMaterials(Integer branchId, Integer limit) {
        int topLimit = limit != null && limit > 0 ? limit : 5;

        String branchName = "Toàn bộ cửa hàng";
        if (branchId != null) {
            Branch branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi nhánh với ID: " + branchId));
            branchName = branch.getName();
        }

        Map<Integer, Double> materialUsageMap = new HashMap<>();
        Map<Integer, String> materialNameMap = new HashMap<>();

        List<Order> allOrders = orderRepository.findAll();

        for (Order order : allOrders) {
            boolean matchBranch = branchId == null ||
                    (order.getBranch() != null && order.getBranch().getId() == branchId.intValue());

            if (matchBranch && order.getOrderItems() != null) {
                for (OrderItem orderItem : order.getOrderItems()) {
                    if (orderItem.getProduct() != null) {
                        Product product = orderItem.getProduct();
                        if (product.getProductRecipes() != null) {
                            for (ProductRecipes recipe : product.getProductRecipes()) {
                                if (recipe.getMaterial() != null) {
                                    int materialId = recipe.getMaterial().getId();
                                    double quantityPerProduct = recipe.getQuantity();
                                    double totalQuantity = quantityPerProduct * orderItem.getQuantity();

                                    materialUsageMap.put(materialId,
                                            materialUsageMap.getOrDefault(materialId, 0.0) + totalQuantity);
                                    materialNameMap.put(materialId, recipe.getMaterial().getName());
                                }
                            }
                        }
                    }
                }
            }
        }

        List<TopMaterialDTO.MaterialUsage> topMaterials = new ArrayList<>();
        for (Map.Entry<Integer, Double> entry : materialUsageMap.entrySet()) {
            topMaterials.add(TopMaterialDTO.MaterialUsage.builder()
                    .materialId(entry.getKey())
                    .materialName(materialNameMap.get(entry.getKey()))
                    .quantityUsed(Math.round(entry.getValue() * 100.0) / 100.0)
                    .unit("kg")
                    .build());
        }

        for (int i = 0; i < topMaterials.size(); i++) {
            for (int j = i + 1; j < topMaterials.size(); j++) {
                if (topMaterials.get(j).getQuantityUsed() > topMaterials.get(i).getQuantityUsed()) {
                    TopMaterialDTO.MaterialUsage temp = topMaterials.get(i);
                    topMaterials.set(i, topMaterials.get(j));
                    topMaterials.set(j, temp);
                }
            }
        }

        if (topMaterials.size() > topLimit) {
            topMaterials = topMaterials.subList(0, topLimit);
        }

        return TopMaterialDTO.builder()
                .branchId(branchId)
                .branchName(branchName)
                .topMaterials(topMaterials)
                .message("Top " + topLimit + " nguyên liệu sử dụng nhiều nhất")
                .build();
    }

    @Override
    public MaterialUsageDTO getMaterialUsageByName(String materialName) {
        if (materialName == null || materialName.isBlank()) {
            throw new IllegalArgumentException("Tên nguyên liệu không được rỗng");
        }

        List<Material> allMaterials = materialRepository.findAll();
        Material targetMaterial = null;

        for (Material material : allMaterials) {
            if (material.getName() != null &&
                    material.getName().toLowerCase().contains(materialName.toLowerCase())) {
                targetMaterial = material;
                break;
            }
        }

        if (targetMaterial == null) {
            throw new ResourceNotFoundException("Không tìm thấy nguyên liệu: " + materialName);
        }

        double totalQuantityUsed = 0.0;
        int orderCount = 0;

        List<Order> allOrders = orderRepository.findAll();

        for (Order order : allOrders) {
            if (order.getOrderItems() != null) {
                for (OrderItem orderItem : order.getOrderItems()) {
                    if (orderItem.getProduct() != null && orderItem.getProduct().getProductRecipes() != null) {
                        for (ProductRecipes recipe : orderItem.getProduct().getProductRecipes()) {
                            if (recipe.getMaterial() != null &&
                                    recipe.getMaterial().getId() == targetMaterial.getId()) {
                                totalQuantityUsed += recipe.getQuantity() * orderItem.getQuantity();
                                orderCount++;
                            }
                        }
                    }
                }
            }
        }

        return MaterialUsageDTO.builder()
                .materialId(targetMaterial.getId())
                .materialName(targetMaterial.getName())
                .totalQuantityUsed(Math.round(totalQuantityUsed * 100.0) / 100.0)
                .unit("kg")
                .totalOrders(orderCount)
                .message("Tổng lượng sử dụng nguyên liệu: " + targetMaterial.getName())
                .build();
    }

    @Override
    public TopSellingItemDTO getTopSellingItems(Integer branchId, Integer limit) {
        int topLimit = limit != null && limit > 0 ? limit : 5;

        Map<String, TopSellingItemDTO.SellingItem> itemMap = new HashMap<>();

        List<Order> allOrders = orderRepository.findAll();

        for (Order order : allOrders) {
            boolean matchBranch = branchId == null ||
                    (order.getBranch() != null && order.getBranch().getId() == branchId.intValue());

            if (matchBranch && order.getOrderItems() != null) {
                for (OrderItem orderItem : order.getOrderItems()) {
                    if (orderItem.getProduct() != null) {
                        Product product = orderItem.getProduct();
                        String key = "PRODUCT_" + product.getId();

                        if (itemMap.containsKey(key)) {
                            TopSellingItemDTO.SellingItem item = itemMap.get(key);
                            item.setQuantitySold(item.getQuantitySold() + orderItem.getQuantity());
                            item.setRevenue(item.getRevenue() + (orderItem.getPrice() * orderItem.getQuantity()));
                        } else {
                            itemMap.put(key, TopSellingItemDTO.SellingItem.builder()
                                    .type("PRODUCT")
                                    .id(product.getId())
                                    .name(product.getName())
                                    .quantitySold(orderItem.getQuantity())
                                    .revenue(orderItem.getPrice() * orderItem.getQuantity())
                                    .imageUrl(product.getImage())
                                    .build());
                        }
                    }

                    if (orderItem.getCombo() != null) {
                        Combo combo = orderItem.getCombo();
                        String key = "COMBO_" + combo.getId();

                        if (itemMap.containsKey(key)) {
                            TopSellingItemDTO.SellingItem item = itemMap.get(key);
                            item.setQuantitySold(item.getQuantitySold() + orderItem.getQuantity());
                            item.setRevenue(item.getRevenue() + (orderItem.getPrice() * orderItem.getQuantity()));
                        } else {
                            itemMap.put(key, TopSellingItemDTO.SellingItem.builder()
                                    .type("COMBO")
                                    .id(combo.getId())
                                    .name(combo.getName())
                                    .quantitySold(orderItem.getQuantity())
                                    .revenue(orderItem.getPrice() * orderItem.getQuantity())
                                    .build());
                        }
                    }
                }
            }
        }

        List<TopSellingItemDTO.SellingItem> allItems = new ArrayList<>(itemMap.values());

        for (int i = 0; i < allItems.size(); i++) {
            for (int j = i + 1; j < allItems.size(); j++) {
                if (allItems.get(j).getQuantitySold() > allItems.get(i).getQuantitySold()) {
                    TopSellingItemDTO.SellingItem temp = allItems.get(i);
                    allItems.set(i, allItems.get(j));
                    allItems.set(j, temp);
                }
            }
        }

        if (allItems.size() > topLimit) {
            allItems = allItems.subList(0, topLimit);
        }

        return TopSellingItemDTO.builder()
                .topItems(allItems)
                .message("Top " + topLimit + " món ăn bán chạy nhất")
                .build();
    }

    @Override
    public ItemSalesDTO getItemSalesByName(String itemName) {
        if (itemName == null || itemName.isBlank()) {
            throw new IllegalArgumentException("Tên món ăn không được rỗng");
        }

        List<Product> allProducts = productRepository.findAll();
        List<Combo> allCombos = comboRepository.findAll();

        Product targetProduct = null;
        Combo targetCombo = null;

        for (Product product : allProducts) {
            if (product.getName() != null &&
                    product.getName().toLowerCase().contains(itemName.toLowerCase())) {
                targetProduct = product;
                break;
            }
        }

        if (targetProduct == null) {
            for (Combo combo : allCombos) {
                if (combo.getName() != null &&
                        combo.getName().toLowerCase().contains(itemName.toLowerCase())) {
                    targetCombo = combo;
                    break;
                }
            }
        }

        if (targetProduct == null && targetCombo == null) {
            throw new ResourceNotFoundException("Không tìm thấy món ăn: " + itemName);
        }

        int totalQuantity = 0;
        double totalRevenue = 0.0;
        int orderCount = 0;

        List<Order> allOrders = orderRepository.findAll();

        for (Order order : allOrders) {
            if (order.getOrderItems() != null) {
                for (OrderItem orderItem : order.getOrderItems()) {
                    boolean isMatch = false;

                    if (targetProduct != null && orderItem.getProduct() != null) {
                        if (orderItem.getProduct().getId() == targetProduct.getId()) {
                            isMatch = true;
                        }
                    }

                    if (targetCombo != null && orderItem.getCombo() != null) {
                        if (orderItem.getCombo().getId() == targetCombo.getId()) {
                            isMatch = true;
                        }
                    }

                    if (isMatch) {
                        totalQuantity += orderItem.getQuantity();
                        totalRevenue += orderItem.getPrice() * orderItem.getQuantity();
                        orderCount++;
                    }
                }
            }
        }

        String type = targetProduct != null ? "PRODUCT" : "COMBO";
        Integer id = targetProduct != null ? targetProduct.getId() : targetCombo.getId();
        String name = targetProduct != null ? targetProduct.getName() : targetCombo.getName();

        return ItemSalesDTO.builder()
                .type(type)
                .id(id)
                .name(name)
                .totalQuantitySold(totalQuantity)
                .totalRevenue(totalRevenue)
                .totalOrders(orderCount)
                .message("Số lượng bán ra của: " + name)
                .build();
    }
}
