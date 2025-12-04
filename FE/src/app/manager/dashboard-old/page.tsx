"use client";

import { Montserrat } from "next/font/google";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  Clock,
  CheckCircle,
} from "lucide-react";
import { ManagerGuard } from "@/components/guards";
import { AdminCard } from "./components/AdminCard";
import { RevenueChart } from "./components/RevenueChart";
import { OrderChannelsChart } from "./components/OrderChannelsChart";
import { TopDishesList } from "./components/TopDishesList";
import { useAdminContext } from "@/utils/contexts/AdminContext";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getRevenueStatistics,
  getOrderCountStatistics,
  getNewCustomerStatistics,
  getServiceTimeStatistics,
  getRevenue7Days,
  getTopSellingItems,
} from "@/apis/statistics.api";
import { revenueData } from "./mockData";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function ManagerDashboardPage() {
  const { selectedBranch, timePeriod, dateRange } = useAdminContext();
  const branchId = useMemo(
    () => (selectedBranch?.id ? selectedBranch.id : 1),
    [selectedBranch?.id]
  );
  const branchIdOrUndefined = useMemo(
    () => (selectedBranch?.id ? selectedBranch.id : undefined),
    [selectedBranch?.id]
  );

  const [serviceComparisonType, setServiceComparisonType] = useState<
    "DAILY" | "MONTHLY"
  >("DAILY");
  const [serviceDate, setServiceDate] = useState("");
  const { data: revenueStats, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["manager-dashboard-revenue", branchId, timePeriod],
    queryFn: () => getRevenueStatistics(branchId),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: orderCountStats, isLoading: isLoadingOrderCount } = useQuery({
    queryKey: ["manager-dashboard-order-count", branchId, timePeriod],
    queryFn: () => getOrderCountStatistics(branchId),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: newCustomerStats, isLoading: isLoadingNewCustomers } = useQuery(
    {
      queryKey: ["manager-dashboard-new-customers", timePeriod],
      queryFn: () => getNewCustomerStatistics("DAILY"),
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const effectiveServiceBranchId = branchId;
  const serviceDateParam = serviceDate ? serviceDate : undefined;

  const { data: serviceTimeStats, isLoading: isLoadingServiceTime } = useQuery({
    queryKey: [
      "manager-dashboard-service-time",
      effectiveServiceBranchId,
      serviceComparisonType,
      serviceDateParam ?? "",
    ],
    queryFn: () =>
      getServiceTimeStatistics(
        effectiveServiceBranchId,
        serviceDateParam,
        serviceComparisonType
      ),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(effectiveServiceBranchId),
  });

  const { data: revenue7DaysData, isLoading: isLoadingRevenue7Days } = useQuery(
    {
      queryKey: ["manager-dashboard-revenue-7days", branchIdOrUndefined],
      queryFn: () => getRevenue7Days(branchIdOrUndefined),
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const { data: topSellingItems, isLoading: isLoadingTopSelling } = useQuery({
    queryKey: ["manager-dashboard-top-selling", branchIdOrUndefined],
    queryFn: () => getTopSellingItems(branchIdOrUndefined, 5),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const isLoading =
    isLoadingRevenue ||
    isLoadingOrderCount ||
    isLoadingNewCustomers ||
    isLoadingServiceTime ||
    isLoadingRevenue7Days ||
    isLoadingTopSelling;

  const operationalKPIs = useMemo(() => {
    const baseKPIs = {
      avgServiceTime: 12.5,
      slaCompliance: 94.2,
    };

    if (serviceTimeStats) {
      return {
        ...baseKPIs,
        avgServiceTime: serviceTimeStats.averageServiceTimeMinutes,
        slaCompliance:
          serviceTimeStats.averageServiceTimeMinutes < 15 ? 94.2 : 87.5,
      };
    }

    return baseKPIs;
  }, [serviceTimeStats]);

  return (
    <ManagerGuard>
      {isLoading ? (
        <p className="text-gray-600 text-sm">
          <span className="ml-2 text-xs text-orange-500">Đang tải...</span>
        </p>
      ) : (
        <div
          className={`${montserrat.className}`}
        >
          <div className="max-w-[1800px]">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">
                {selectedBranch ? selectedBranch.name : "Tổng quan chi nhánh"}
              </h1>
              <div className="text-xs text-gray-500">
                {new Date().toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 mt-4">
                <Activity className="w-4 h-4 text-[#EC6426]" />
                <h2 className="text-base font-semibold text-gray-800">
                  Phân tích & Hoạt động
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2">
                  <RevenueChart
                    data={
                      revenue7DaysData
                        ? revenue7DaysData.dailyRevenues.map((item) => ({
                          date: item.date,
                          revenue: item.revenue,
                        }))
                        : revenueData
                    }
                  />
                </div>
                <OrderChannelsChart data={orderCountStats} />
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <TopDishesList
                    data={topSellingItems?.items}
                    isLoading={isLoadingTopSelling}
                  />
                </div>
                <div className="lg:col-span-2 grid grid-cols-2 gap-2.5 h-full bg-[#FDE3CF]/90 p-2 rounded-xl">
                  <div className="space-y-2.5 ">
                    <AdminCard
                      title="Doanh thu hôm nay"
                      value={
                        revenueStats
                          ? `${revenueStats.totalRevenue.toLocaleString("vi-VN")}đ`
                          : "..."
                      }
                      icon={DollarSign}
                      subtitle={
                        revenueStats ? `${revenueStats.totalOrders} đơn` : ""
                      }
                      isLoading={isLoadingRevenue}
                    />
                    <AdminCard
                      title="Tổng đơn hàng"
                      value={
                        orderCountStats ? orderCountStats.totalOrders : "..."
                      }
                      icon={ShoppingCart}
                      subtitle={
                        orderCountStats
                          ? `${orderCountStats.shippingOrders + orderCountStats.pickupOrders + orderCountStats.diningOrders} kênh`
                          : ""
                      }
                      isLoading={isLoadingOrderCount}
                    />
                    <AdminCard
                      title="Khách hàng mới"
                      value={
                        newCustomerStats
                          ? newCustomerStats.newCustomersToday
                          : "..."
                      }
                      icon={Users}
                      trend={
                        newCustomerStats
                          ? {
                            value: newCustomerStats.percentageChange,
                            isPositive:
                              newCustomerStats.percentageChange >= 0,
                          }
                          : undefined
                      }
                      subtitle={
                        newCustomerStats
                          ? `vs. ${newCustomerStats.newCustomersComparison} hôm qua`
                          : ""
                      }
                      isLoading={isLoadingNewCustomers}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <AdminCard
                      title="TG phục vụ TB"
                      value={
                        serviceTimeStats
                          ? `${serviceTimeStats.averageServiceTimeMinutes.toFixed(1)}p`
                          : "..."
                      }
                      icon={Clock}
                      trend={
                        serviceTimeStats
                          ? {
                            value: serviceTimeStats.percentageChange,
                            isPositive:
                              serviceTimeStats.percentageChange <= 0,
                          }
                          : undefined
                      }
                      subtitle={
                        serviceTimeStats
                          ? `${serviceTimeStats.totalOrdersProcessed} đơn`
                          : ""
                      }
                      isLoading={isLoadingServiceTime}
                    />
                    <AdminCard
                      title="SLA Phục vụ"
                      value={`${operationalKPIs.slaCompliance.toFixed(1)}%`}
                      icon={CheckCircle}
                      subtitle={
                        operationalKPIs.slaCompliance >= 90
                          ? "Đạt chuẩn"
                          : "Dưới mục tiêu"
                      }
                      isLoading={isLoadingServiceTime}
                    />
                    <AdminCard
                      title="Tỷ lệ hoàn thành"
                      value={
                        orderCountStats && revenueStats
                          ? `${((revenueStats.totalOrders / (orderCountStats.totalOrders || 1)) * 100).toFixed(1)}%`
                          : "..."
                      }
                      icon={Activity}
                      subtitle={
                        orderCountStats
                          ? `${orderCountStats.totalOrders} đơn xử lý`
                          : ""
                      }
                      isLoading={isLoadingOrderCount || isLoadingRevenue}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ManagerGuard>
  );
}
