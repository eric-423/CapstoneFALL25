package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.dto.*;
import com.capstone.tamtech.capstone.entities.*;
import com.capstone.tamtech.capstone.repositories.*;
import com.capstone.tamtech.capstone.services.impl.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    private Date getDefaultFromDate() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -30);
        return cal.getTime();
    }

    private Date getDefaultToDate() {
        return new Date();
    }

    private List<Order> getFilteredOrders(Integer branchId, Date fromDate, Date toDate) {
        if (fromDate == null)
            fromDate = getDefaultFromDate();
        if (toDate == null)
            toDate = getDefaultToDate();
        else {
            Calendar cal = Calendar.getInstance();
            cal.setTime(toDate);
            cal.set(Calendar.HOUR_OF_DAY, 23);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            cal.set(Calendar.MILLISECOND, 999);
            toDate = cal.getTime();
        }
        return orderRepository.findCompletedOrdersByFilters(branchId, fromDate, toDate);
    }

    private Date normalizeToEndOfDay(Date date) {
        if (date == null)
            return null;
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        return cal.getTime();
    }

    @Override
    public List<DashboardKPIDTO> getKPIs(Integer branchId, Date fromDate, Date toDate) {
        if (fromDate == null)
            fromDate = getDefaultFromDate();
        if (toDate == null)
            toDate = getDefaultToDate();
        else
            toDate = normalizeToEndOfDay(toDate);

        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        long periodDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
        Date prevFromDate = new Date(fromDate.getTime() - (periodDays + 1) * 24 * 60 * 60 * 1000);
        Date prevToDate = normalizeToEndOfDay(new Date(fromDate.getTime() - 24 * 60 * 60 * 1000));
        List<Order> prevOrders = orderRepository.findCompletedOrdersByFilters(branchId, prevFromDate, prevToDate);

        double totalRevenue = orders.stream().mapToDouble(Order::getAmount).sum();
        double prevRevenue = prevOrders.stream().mapToDouble(Order::getAmount).sum();
        double revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

        long orderCount = orders.size();
        long prevOrderCount = prevOrders.size();
        double orderChange = prevOrderCount > 0 ? ((double) (orderCount - prevOrderCount) / prevOrderCount) * 100 : 0;

        long newCustomers = orderRepository.countDistinctCustomers(branchId, fromDate, toDate);
        long prevNewCustomers = orderRepository.countDistinctCustomers(branchId, prevFromDate, prevToDate);
        double customerChange = prevNewCustomers > 0
                ? ((double) (newCustomers - prevNewCustomers) / prevNewCustomers) * 100
                : 0;

        double avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
        double prevAvgOrderValue = prevOrderCount > 0 ? prevRevenue / prevOrderCount : 0;
        double avgOrderChange = prevAvgOrderValue > 0 ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100
                : 0;

        List<DashboardKPIDTO> kpis = new ArrayList<>();
        kpis.add(new DashboardKPIDTO("Tổng Doanh Thu", totalRevenue, "₫", revenueChange,
                revenueChange >= 0 ? "UP" : "DOWN"));
        kpis.add(new DashboardKPIDTO("Đơn Hàng", (double) orderCount, null, orderChange,
                orderChange >= 0 ? "UP" : "DOWN"));
        kpis.add(new DashboardKPIDTO("Khách Hàng Mới", (double) newCustomers, null, customerChange,
                customerChange >= 0 ? "UP" : "DOWN"));
        kpis.add(new DashboardKPIDTO("Giá Trị Đơn TB", avgOrderValue, "₫", avgOrderChange,
                avgOrderChange >= 0 ? "UP" : "DOWN"));

        return kpis;
    }

    @Override
    public List<RevenueChartDTO> getRevenueChart(Integer branchId, Date fromDate, Date toDate, String groupBy) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        if (groupBy == null)
            groupBy = "day";

        Map<String, Double> revenueMap = new LinkedHashMap<>();
        SimpleDateFormat dateFormat;

        switch (groupBy.toLowerCase()) {
            case "week":
                dateFormat = new SimpleDateFormat("yyyy-'W'ww");
                break;
            case "month":
                dateFormat = new SimpleDateFormat("yyyy-MM");
                break;
            default:
                dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        }

        for (Order order : orders) {
            String timeKey = dateFormat.format(order.getCreatedAt());
            revenueMap.put(timeKey, revenueMap.getOrDefault(timeKey, 0.0) + order.getAmount());
        }

        return revenueMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new RevenueChartDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<RevenueByChannelDTO> getRevenueByChannel(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        double totalRevenue = orders.stream().mapToDouble(Order::getAmount).sum();

        double tableRevenue = orders.stream()
                .filter(o -> Boolean.TRUE.equals(o.getIsTable()))
                .mapToDouble(Order::getAmount)
                .sum();

        double pickupRevenue = orders.stream()
                .filter(o -> o.isPickUp() && !Boolean.TRUE.equals(o.getIsTable()))
                .mapToDouble(Order::getAmount)
                .sum();

        double deliveryRevenue = orders.stream()
                .filter(o -> !o.isPickUp() && !Boolean.TRUE.equals(o.getIsTable()))
                .mapToDouble(Order::getAmount)
                .sum();

        List<RevenueByChannelDTO> channels = new ArrayList<>();
        if (totalRevenue > 0) {
            channels.add(new RevenueByChannelDTO("Tại bàn", tableRevenue, (tableRevenue / totalRevenue) * 100));
            channels.add(new RevenueByChannelDTO("Mang về", pickupRevenue, (pickupRevenue / totalRevenue) * 100));
            channels.add(new RevenueByChannelDTO("Giao hàng", deliveryRevenue, (deliveryRevenue / totalRevenue) * 100));
        }

        return channels;
    }

    @Override
    public List<PeakHoursDTO> getPeakHours(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        Map<String, Long> hourCountMap = new HashMap<>();
        SimpleDateFormat hourFormat = new SimpleDateFormat("HH:mm");

        for (Order order : orders) {
            String hour = hourFormat.format(order.getCreatedAt());
            hourCountMap.put(hour, hourCountMap.getOrDefault(hour, 0L) + 1);
        }

        return hourCountMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new PeakHoursDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<TopSellingProductDTO> getTopSellingProducts(Integer branchId, Date fromDate, Date toDate,
            Integer limit) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        Map<Integer, ProductStatsDTO> productStatsMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct() != null) {
                    int productId = item.getProduct().getId();
                    ProductStatsDTO stats = productStatsMap.getOrDefault(productId, new ProductStatsDTO());
                    stats.setProductId(productId);
                    stats.setProductName(item.getProduct().getName());
                    stats.setQuantitySold(stats.getQuantitySold() + item.getQuantity());
                    stats.setTotalRevenue(stats.getTotalRevenue() + item.getPrice() * item.getQuantity());
                    stats.setImage(item.getProduct().getImage());
                    productStatsMap.put(productId, stats);
                }
            }
        }

        return productStatsMap.values().stream()
                .sorted((a, b) -> Double.compare(b.getTotalRevenue(), a.getTotalRevenue()))
                .limit(limit != null ? limit : 10)
                .map(stats -> new TopSellingProductDTO(
                        stats.getProductId(),
                        stats.getProductName(),
                        stats.getQuantitySold(),
                        stats.getTotalRevenue(),
                        stats.getImage()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductPerformanceDTO> getProductPerformance(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        Map<Integer, ProductStatsDTO> productStatsMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct() != null) {
                    int productId = item.getProduct().getId();
                    ProductStatsDTO stats = productStatsMap.getOrDefault(productId, new ProductStatsDTO());
                    stats.setProductId(productId);
                    stats.setProductName(item.getProduct().getName());
                    stats.setQuantitySold(stats.getQuantitySold() + item.getQuantity());
                    stats.setTotalRevenue(stats.getTotalRevenue() + item.getPrice() * item.getQuantity());
                    productStatsMap.put(productId, stats);
                }
            }
        }

        return productStatsMap.values().stream()
                .map(stats -> new ProductPerformanceDTO(
                        stats.getProductId(),
                        stats.getProductName(),
                        stats.getQuantitySold(),
                        stats.getTotalRevenue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ComboEffectivenessDTO> getComboEffectiveness(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        Map<Integer, ComboStatsDTO> comboStatsMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getCombo() != null) {
                    int comboId = item.getCombo().getId();
                    ComboStatsDTO stats = comboStatsMap.getOrDefault(comboId, new ComboStatsDTO());
                    stats.setComboName(item.getCombo().getName());
                    stats.setOrders(stats.getOrders() + 1);
                    stats.setRevenue(stats.getRevenue() + item.getPrice() * item.getQuantity());
                    comboStatsMap.put(comboId, stats);
                }
            }
        }

        return comboStatsMap.values().stream()
                .map(stats -> new ComboEffectivenessDTO(
                        stats.getComboName(),
                        stats.getOrders(),
                        stats.getRevenue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<PromotionEffectivenessDTO> getPromotionEffectiveness(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        Map<String, PromotionStatsDTO> promotionStatsMap = new HashMap<>();

        for (Order order : orders) {
            if (order.getPromotionCode() != null && !order.getPromotionCode().isEmpty()) {
                String code = order.getPromotionCode();
                PromotionStatsDTO stats = promotionStatsMap.getOrDefault(code, new PromotionStatsDTO());
                stats.setCode(code);
                stats.setUsageCount(stats.getUsageCount() + 1);
                stats.setRevenueGenerated(stats.getRevenueGenerated() + order.getAmount());
                promotionStatsMap.put(code, stats);
            }
        }

        return promotionStatsMap.values().stream()
                .map(stats -> new PromotionEffectivenessDTO(
                        stats.getCode(),
                        stats.getUsageCount(),
                        stats.getRevenueGenerated()))
                .collect(Collectors.toList());
    }

    @Override
    public List<VoucherRevenueDTO> getVoucherRevenue(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        Map<String, Double> voucherRevenueMap = new HashMap<>();

        for (Order order : orders) {
            if (order.getPromotion() != null && order.getPromotion().getPromotionType() != null) {
                String type = order.getPromotion().getPromotionType().getName();
                voucherRevenueMap.put(type, voucherRevenueMap.getOrDefault(type, 0.0) + order.getAmount());
            }
        }

        return voucherRevenueMap.entrySet().stream()
                .map(entry -> new VoucherRevenueDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<KitchenPerformanceDTO> getKitchenPerformance(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        Map<String, List<Long>> timeSlotPrepTimes = new HashMap<>();
        timeSlotPrepTimes.put("Sáng (6h-10h)", new ArrayList<>());
        timeSlotPrepTimes.put("Trưa (11h-14h)", new ArrayList<>());
        timeSlotPrepTimes.put("Chiều (15h-17h)", new ArrayList<>());
        timeSlotPrepTimes.put("Tối (18h-22h)", new ArrayList<>());

        Calendar cal = Calendar.getInstance();
        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getCookedAt() != null && item.getConfirmAt() != null) {
                    long prepTime = (item.getCookedAt().getTime() - item.getConfirmAt().getTime()) / (1000 * 60);

                    cal.setTime(item.getConfirmAt());
                    int hour = cal.get(Calendar.HOUR_OF_DAY);

                    String timeSlot;
                    if (hour >= 6 && hour < 10) {
                        timeSlot = "Sáng (6h-10h)";
                    } else if (hour >= 11 && hour < 14) {
                        timeSlot = "Trưa (11h-14h)";
                    } else if (hour >= 15 && hour < 17) {
                        timeSlot = "Chiều (15h-17h)";
                    } else if (hour >= 18 && hour < 22) {
                        timeSlot = "Tối (18h-22h)";
                    } else {
                        continue;
                    }

                    timeSlotPrepTimes.get(timeSlot).add(prepTime);
                }
            }
        }

        return timeSlotPrepTimes.entrySet().stream()
                .map(entry -> {
                    List<Long> times = entry.getValue();
                    double avg = times.isEmpty() ? 0 : times.stream().mapToLong(Long::longValue).average().orElse(0);
                    return new KitchenPerformanceDTO(entry.getKey(), avg);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<StaffPerformanceDTO> getStaffPerformance(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        Map<Integer, StaffStatsDTO> staffStatsMap = new HashMap<>();

        for (Order order : orders) {
            if (order.getWaiter() != null) {
                int staffId = order.getWaiter().getId();
                StaffStatsDTO stats = staffStatsMap.getOrDefault(staffId, new StaffStatsDTO());
                stats.setStaffName(order.getWaiter().getFullName());
                stats.setOrdersHandled(stats.getOrdersHandled() + 1);
                staffStatsMap.put(staffId, stats);
            }
        }

        return staffStatsMap.values().stream()
                .map(stats -> new StaffPerformanceDTO(
                        stats.getStaffName(),
                        stats.getOrdersHandled(),
                        0.0))
                .sorted((a, b) -> Long.compare(b.getOrdersHandled(), a.getOrdersHandled()))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderFlowDTO> getOrderFlow(Integer branchId, Date fromDate, Date toDate) {
        List<Order> orders = getFilteredOrders(branchId, fromDate, toDate);

        List<Long> confirmTimes = new ArrayList<>();
        List<Long> cookTimes = new ArrayList<>();
        List<Long> deliverTimes = new ArrayList<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getConfirmAt() != null && order.getCreatedAt() != null) {
                    long confirmTime = (item.getConfirmAt().getTime() - order.getCreatedAt().getTime()) / 1000;
                    confirmTimes.add(confirmTime);
                }

                if (item.getCookedAt() != null && item.getConfirmAt() != null) {
                    long cookTime = (item.getCookedAt().getTime() - item.getConfirmAt().getTime()) / 1000;
                    cookTimes.add(cookTime);
                }

                if (item.getDeliveredAt() != null && item.getCookedAt() != null) {
                    long deliverTime = (item.getDeliveredAt().getTime() - item.getCookedAt().getTime()) / 1000;
                    deliverTimes.add(deliverTime);
                }
            }
        }

        List<OrderFlowDTO> flow = new ArrayList<>();
        flow.add(new OrderFlowDTO("Đặt món", 0L));

        double avgConfirm = confirmTimes.isEmpty() ? 0
                : confirmTimes.stream().mapToLong(Long::longValue).average().orElse(0);
        flow.add(new OrderFlowDTO("Xác nhận", (long) avgConfirm));

        double avgCook = cookTimes.isEmpty() ? 0 : cookTimes.stream().mapToLong(Long::longValue).average().orElse(0);
        flow.add(new OrderFlowDTO("Chế biến", (long) avgCook));

        double avgDeliver = deliverTimes.isEmpty() ? 0
                : deliverTimes.stream().mapToLong(Long::longValue).average().orElse(0);
        flow.add(new OrderFlowDTO("Hoàn tất", (long) avgDeliver));

        return flow;
    }

}
