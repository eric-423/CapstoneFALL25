"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Loader2,
  LayoutDashboard,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { BranchesLoader } from "@/app/admin/components/BranchesLoader";
import { DateRange } from "react-day-picker";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../components/AdminPageLayout";
import { useAdminContext } from "@/utils/contexts/AdminContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// API Imports
import {
  getDashboardKPIs,
  getRevenueChartData,
  getRevenueByChannel,
  getPeakHoursData,
  getTopSellingProducts,
  getProductPerformance,
  getComboEffectiveness,
  getPromotionEffectiveness,
  getVoucherRevenue,
  getKitchenPerformance,
  getStaffPerformance,
  getOrderFlow,
  DashboardFilterParams,
  DashboardKPIItem,
  RevenueChartItem,
  RevenueByChannelItem,
  PeakHoursItem,
  TopSellingProductItem,
  ProductPerformanceItem,
  ComboEffectivenessItem,
  PromotionEffectivenessItem,
  VoucherRevenueItem,
  KitchenPerformanceItem,
  StaffPerformanceItem,
  OrderFlowItem,
} from "@/apis/dashboard.api";

// Component Imports
import KPICards from "./components/overview/KPICards";
import RevenueChart from "./components/overview/RevenueChart";
import SalesByChannelChart from "./components/overview/SalesByChannelChart";
import PeakHoursChart from "./components/overview/PeakHoursChart";

import TopProducts from "./components/products/TopProducts";
import ProductPerformanceChart from "./components/products/ProductPerformanceChart";
import ComboEffectivenessChart from "./components/products/ComboEffectivenessChart";

import PromotionPerformanceChart from "./components/marketing/PromotionPerformanceChart";
import VoucherRevenueChart from "./components/marketing/VoucherRevenueChart";

import KitchenPerformanceChart from "./components/operations/KitchenPerformanceChart";
import StaffPerformanceChart from "./components/operations/StaffPerformanceChart";
import OrderFlowChart from "./components/operations/OrderFlowChart";

export default function DashboardTabsPage() {
  const { branches } = useAdminContext();

  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Track which tabs have been fetched
  const [fetchedTabs, setFetchedTabs] = useState<Set<string>>(
    new Set(["overview"])
  );

  // Loading states
  const [loading, setLoading] = useState({
    kpis: true,
    revenueChart: true,
    channelRevenue: true,
    peakHours: true,
    topProducts: false,
    productPerformance: false,
    comboEffectiveness: false,
    promotions: false,
    vouchers: false,
    kitchenPerformance: false,
    staffPerformance: false,
    orderFlow: false,
  });

  // Revenue chart groupBy state
  const [revenueGroupBy, setRevenueGroupBy] = useState<
    "day" | "week" | "month"
  >("day");

  // Data states
  const [kpis, setKpis] = useState<DashboardKPIItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueChartItem[]>([]);
  const [channelData, setChannelData] = useState<RevenueByChannelItem[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<PeakHoursItem[]>([]);
  const [topProductsData, setTopProductsData] = useState<
    TopSellingProductItem[]
  >([]);
  const [productPerformanceData, setProductPerformanceData] = useState<
    ProductPerformanceItem[]
  >([]);
  const [comboData, setComboData] = useState<ComboEffectivenessItem[]>([]);
  const [promotionData, setPromotionData] = useState<
    PromotionEffectivenessItem[]
  >([]);
  const [voucherData, setVoucherData] = useState<VoucherRevenueItem[]>([]);
  const [kitchenData, setKitchenData] = useState<KitchenPerformanceItem[]>([]);
  const [staffData, setStaffData] = useState<StaffPerformanceItem[]>([]);
  const [orderFlowData, setOrderFlowData] = useState<OrderFlowItem[]>([]);

  // Build filter params
  const buildFilterParams = useCallback((): DashboardFilterParams => {
    const params: DashboardFilterParams = {};
    if (selectedBranch !== "all") {
      params.branchId = parseInt(selectedBranch);
    }
    if (dateRange?.from) {
      params.fromDate = format(dateRange.from, "yyyy-MM-dd");
    }
    if (dateRange?.to) {
      // If start date equals end date, add 1 day to end date for API call
      const fromDateStr = dateRange.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : "";
      const toDateStr = format(dateRange.to, "yyyy-MM-dd");

      if (fromDateStr === toDateStr) {
        const nextDay = new Date(dateRange.to);
        nextDay.setDate(nextDay.getDate() + 1);
        params.toDate = format(nextDay, "yyyy-MM-dd");
      } else {
        params.toDate = toDateStr;
      }
    }
    return params;
  }, [selectedBranch, dateRange]);

  // Fetch Overview Data
  const fetchOverviewData = useCallback(async () => {
    const params = buildFilterParams();

    // Fetch KPIs
    setLoading((prev) => ({ ...prev, kpis: true }));
    try {
      const response = await getDashboardKPIs(params);
      if (response.data) {
        setKpis(response.data);
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    } finally {
      setLoading((prev) => ({ ...prev, kpis: false }));
    }

    // Fetch Channel Revenue
    setLoading((prev) => ({ ...prev, channelRevenue: true }));
    try {
      const response = await getRevenueByChannel(params);
      if (response.data) {
        const colors = [
          "var(--color-chart-1)",
          "var(--color-chart-2)",
          "var(--color-chart-3)",
          "var(--color-chart-4)",
        ];
        setChannelData(
          response.data.map((item, index) => ({
            ...item,
            fill: colors[index % colors.length],
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching channel revenue:", error);
    } finally {
      setLoading((prev) => ({ ...prev, channelRevenue: false }));
    }

    // Fetch Peak Hours
    setLoading((prev) => ({ ...prev, peakHours: true }));
    try {
      const response = await getPeakHoursData(params);
      if (response.data) {
        setPeakHoursData(response.data);
      }
    } catch (error) {
      console.error("Error fetching peak hours:", error);
    } finally {
      setLoading((prev) => ({ ...prev, peakHours: false }));
    }
  }, [buildFilterParams]);

  // Fetch Revenue Chart Data (separate function for groupBy changes)
  const fetchRevenueChart = useCallback(
    async (groupBy: "day" | "week" | "month") => {
      const params = buildFilterParams();
      setLoading((prev) => ({ ...prev, revenueChart: true }));
      try {
        const response = await getRevenueChartData({ ...params, groupBy });
        if (response.data) {
          setRevenueData(response.data);
        }
      } catch (error) {
        console.error("Error fetching revenue chart:", error);
      } finally {
        setLoading((prev) => ({ ...prev, revenueChart: false }));
      }
    },
    [buildFilterParams]
  );

  // Handle groupBy change for revenue chart - stable reference
  const handleRevenueGroupByChange = useCallback(
    (groupBy: "day" | "week" | "month") => {
      setRevenueGroupBy(groupBy);
      // Directly call API without depending on fetchRevenueChart to avoid reference changes
      const params = buildFilterParams();
      setLoading((prev) => ({ ...prev, revenueChart: true }));
      getRevenueChartData({ ...params, groupBy })
        .then((response) => {
          if (response.data) {
            setRevenueData(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching revenue chart:", error);
        })
        .finally(() => {
          setLoading((prev) => ({ ...prev, revenueChart: false }));
        });
    },
    [buildFilterParams]
  );

  // Fetch Products Data
  const fetchProductsData = useCallback(async () => {
    const params = buildFilterParams();

    // Fetch Top Products
    setLoading((prev) => ({ ...prev, topProducts: true }));
    try {
      const response = await getTopSellingProducts({ ...params, limit: 10 });
      if (response.data) {
        setTopProductsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setLoading((prev) => ({ ...prev, topProducts: false }));
    }

    // Fetch Product Performance
    setLoading((prev) => ({ ...prev, productPerformance: true }));
    try {
      const response = await getProductPerformance(params);
      if (response.data) {
        setProductPerformanceData(response.data);
      }
    } catch (error) {
      console.error("Error fetching product performance:", error);
    } finally {
      setLoading((prev) => ({ ...prev, productPerformance: false }));
    }

    // Fetch Combo Effectiveness
    setLoading((prev) => ({ ...prev, comboEffectiveness: true }));
    try {
      const response = await getComboEffectiveness(params);
      if (response.data) {
        setComboData(response.data);
      }
    } catch (error) {
      console.error("Error fetching combo effectiveness:", error);
    } finally {
      setLoading((prev) => ({ ...prev, comboEffectiveness: false }));
    }
  }, [buildFilterParams]);

  // Fetch Marketing Data
  const fetchMarketingData = useCallback(async () => {
    const params = buildFilterParams();

    // Fetch Promotions
    setLoading((prev) => ({ ...prev, promotions: true }));
    try {
      const response = await getPromotionEffectiveness(params);
      if (response.data) {
        setPromotionData(response.data);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading((prev) => ({ ...prev, promotions: false }));
    }

    // Fetch Voucher Revenue
    setLoading((prev) => ({ ...prev, vouchers: true }));
    try {
      const response = await getVoucherRevenue(params);
      if (response.data) {
        const colors = [
          "var(--color-chart-1)",
          "var(--color-chart-2)",
          "var(--color-chart-3)",
          "var(--color-chart-4)",
        ];
        setVoucherData(
          response.data.map((item, index) => ({
            ...item,
            fill: colors[index % colors.length],
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching voucher revenue:", error);
    } finally {
      setLoading((prev) => ({ ...prev, vouchers: false }));
    }
  }, [buildFilterParams]);

  // Fetch Operations Data
  const fetchOperationsData = useCallback(async () => {
    const params = buildFilterParams();

    // Fetch Kitchen Performance
    setLoading((prev) => ({ ...prev, kitchenPerformance: true }));
    try {
      const response = await getKitchenPerformance(params);
      if (response.data) {
        setKitchenData(response.data);
      }
    } catch (error) {
      console.error("Error fetching kitchen performance:", error);
    } finally {
      setLoading((prev) => ({ ...prev, kitchenPerformance: false }));
    }

    // Fetch Staff Performance
    setLoading((prev) => ({ ...prev, staffPerformance: true }));
    try {
      const response = await getStaffPerformance(params);
      if (response.data) {
        setStaffData(response.data);
      }
    } catch (error) {
      console.error("Error fetching staff performance:", error);
    } finally {
      setLoading((prev) => ({ ...prev, staffPerformance: false }));
    }

    // Fetch Order Flow
    setLoading((prev) => ({ ...prev, orderFlow: true }));
    try {
      const response = await getOrderFlow(params);
      if (response.data) {
        setOrderFlowData(response.data);
      }
    } catch (error) {
      console.error("Error fetching order flow:", error);
    } finally {
      setLoading((prev) => ({ ...prev, orderFlow: false }));
    }
  }, [buildFilterParams]);

  // Fetch all data on mount and when filters change
  useEffect(() => {
    // Always fetch overview data (default tab)
    fetchOverviewData();
    fetchRevenueChart(revenueGroupBy);

    // Reset fetched tabs when filters change, keeping only overview
    setFetchedTabs(new Set(["overview"]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOverviewData, fetchRevenueChart]);

  // Fetch data when tab changes
  useEffect(() => {
    if (fetchedTabs.has(activeTab)) return; // Already fetched

    switch (activeTab) {
      case "products":
        fetchProductsData();
        break;
      case "marketing":
        fetchMarketingData();
        break;
      case "operations":
        fetchOperationsData();
        break;
    }

    setFetchedTabs((prev) => new Set([...prev, activeTab]));
  }, [
    activeTab,
    fetchedTabs,
    fetchProductsData,
    fetchMarketingData,
    fetchOperationsData,
  ]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };
  const isInitialLoading = useMemo(() => {
    return loading.kpis || loading.channelRevenue || loading.peakHours;
  }, [loading.kpis, loading.channelRevenue, loading.peakHours]);

  const isSingleDay =
    dateRange?.from &&
    dateRange?.to &&
    format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd");

  return (
    <AdminPageLayout>
      <BranchesLoader />
      <AdminPageHeader
        title="Tổng quan"
        icon={LayoutDashboard}
        actions={
          <div className="flex flex-wrap items-center gap-3 justify-between">
            {isInitialLoading && (
              <div className="flex items-center gap-2 text-[#2D1E1A]/60">
                <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />
                <span className="text-sm font-medium">Đang tải...</span>
              </div>
            )}
          </div>
        }
      />

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-center gap-3 justify-between mb-0">
          <div className="flex items-center gap-3">
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-[200px] bg-white/80 border-gray-300 hover:bg-white hover:border-gray-300">
                <Building2 className="mr-2 h-4 w-4 text-[#78A243]" />
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 shadow-lg rounded-xl">
                <SelectItem value="all" className="hover:bg-[#78A243]/10">
                  Tất cả chi nhánh
                </SelectItem>
                {branches.map((branch) => (
                  <SelectItem
                    key={branch.id}
                    value={branch.id.toString()}
                    className="hover:bg-[#78A243]/10"
                  >
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-medium bg-white/80 border-gray-300 hover:bg-white hover:border-gray-300",
                    !dateRange && "text-[#2D1E1A]/50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#78A243]" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span className="text-[#2D1E1A]">
                        {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                      </span>
                    ) : (
                      <span className="text-[#2D1E1A]">
                        {format(dateRange.from, "dd/MM/yyyy", { locale: vi })}
                      </span>
                    )
                  ) : (
                    <span>Chọn khoảng thời gian</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white border-gray-300 shadow-lg rounded-xl"
                align="end"
              >
                <div className="p-3 border-b border-gray-300 bg-gradient-to-r from-[#EBD187]/20 to-[#78A243]/10">
                  <p className="text-sm font-bold text-[#2D1E1A]">
                    Chọn khoảng thời gian
                  </p>
                  <p className="text-xs text-[#2D1E1A]/60 mt-1">
                    Nhấn vào ngày bắt đầu và kết thúc
                  </p>
                </div>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                  initialFocus
                  className="p-3"
                  disabled={{ after: new Date() }}
                />
                <div className="p-3 border-t border-gray-300 flex gap-2 bg-[#EBD187]/10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-300 hover:bg-[#78A243]/10 hover:border-gray-300"
                    onClick={() => {
                      const today = new Date();
                      const sevenDaysAgo = new Date(today);
                      sevenDaysAgo.setDate(today.getDate() - 7);
                      handleDateRangeSelect({ from: sevenDaysAgo, to: today });
                    }}
                  >
                    7 ngày
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-300 hover:bg-[#78A243]/10 hover:border-gray-300"
                    onClick={() => {
                      const today = new Date();
                      const thirtyDaysAgo = new Date(today);
                      thirtyDaysAgo.setDate(today.getDate() - 30);
                      handleDateRangeSelect({ from: thirtyDaysAgo, to: today });
                    }}
                  >
                    30 ngày
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-300 hover:bg-[#78A243]/10 hover:border-gray-300"
                    onClick={() => {
                      const today = new Date();
                      const ninetyDaysAgo = new Date(today);
                      ninetyDaysAgo.setDate(today.getDate() - 90);
                      handleDateRangeSelect({ from: ninetyDaysAgo, to: today });
                    }}
                  >
                    90 ngày
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-white/60 h-11 p-1 rounded-xl border border-gray-300 dashboard-tabs">
            <TabsTrigger
              value="overview"
              className="h-full rounded-lg data-[state=active]:shadow-none text-[#2D1E1A]/70 font-medium transition-colors"
            >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="h-full rounded-lg data-[state=active]:shadow-none text-[#2D1E1A]/70 font-medium transition-colors"
            >
              Sản phẩm
            </TabsTrigger>
            <TabsTrigger
              value="marketing"
              className="h-full rounded-lg data-[state=active]:shadow-none text-[#2D1E1A]/70 font-medium transition-colors"
            >
              Marketing
            </TabsTrigger>
            <TabsTrigger
              value="operations"
              className="h-full rounded-lg data-[state=active]:shadow-none text-[#2D1E1A]/70 font-medium transition-colors"
            >
              Vận hành
            </TabsTrigger>
          </TabsList>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .dashboard-tabs [data-slot="tabs-trigger"][data-state="active"],
              .dashboard-tabs button[data-state="active"] {
                background-color: #DA7339 !important;
                color: white !important;
              }
            `,
            }}
          />
        </div>

        <TabsContent
          value="overview"
          className="space-y-6 animate-in fade-in-50 duration-500"
        >
          <KPICards
            kpis={kpis}
            isLoading={loading.kpis}
            showTrend={isSingleDay}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[400px]">
              <RevenueChart
                data={revenueData}
                groupBy={revenueGroupBy}
                onGroupByChange={handleRevenueGroupByChange}
                isLoading={loading.revenueChart}
              />
            </div>
            <div className="h-[400px]">
              <SalesByChannelChart
                data={channelData}
                isLoading={loading.channelRevenue}
              />
            </div>
          </div>

          <div className="h-[400px]">
            <PeakHoursChart
              data={peakHoursData}
              isLoading={loading.peakHours}
            />
          </div>
        </TabsContent>

        {/* TAB 2: PRODUCTS */}
        <TabsContent
          value="products"
          className="space-y-6 animate-in fade-in-50 duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[450px]">
              <ProductPerformanceChart
                data={
                  productPerformanceData.length > 0
                    ? productPerformanceData
                    : topProductsData
                }
                isLoading={loading.productPerformance || loading.topProducts}
              />
            </div>
            <div className="h-[450px]">
              <TopProducts
                data={topProductsData}
                isLoading={loading.topProducts}
              />
            </div>
          </div>

          <div className="h-[400px]">
            <ComboEffectivenessChart
              data={comboData}
              isLoading={loading.comboEffectiveness}
            />
          </div>
        </TabsContent>

        {/* TAB 3: MARKETING */}
        <TabsContent
          value="marketing"
          className="space-y-6 animate-in fade-in-50 duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[400px]">
              <PromotionPerformanceChart
                data={promotionData}
                isLoading={loading.promotions}
              />
            </div>
            <div className="h-[400px]">
              <VoucherRevenueChart
                data={voucherData}
                isLoading={loading.vouchers}
              />
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: OPERATIONS */}
        <TabsContent
          value="operations"
          className="space-y-6 animate-in fade-in-50 duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KitchenPerformanceChart
              data={kitchenData}
              isLoading={loading.kitchenPerformance}
            />
            <StaffPerformanceChart
              data={staffData}
              isLoading={loading.staffPerformance}
            />
          </div>

          <OrderFlowChart data={orderFlowData} isLoading={loading.orderFlow} />
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
}
