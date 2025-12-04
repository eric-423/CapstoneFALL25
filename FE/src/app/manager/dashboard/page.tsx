"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar as CalendarIcon, Loader2, Activity, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { ManagerGuard } from '@/components/guards';
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { getCookie } from '@/utils/cookies.client';
import { getBranches, type Branch } from '@/apis/branch.api';

// Dashboard API
import {
    getDashboardKPIs,
    getRevenueChartData,
    getRevenueByChannel,
    getPeakHoursData,
    getTopSellingProducts,
    getKitchenPerformance,
    getStaffPerformance,
    DashboardFilterParams,
    type DashboardKPIItem,
    type RevenueChartItem,
    type RevenueByChannelItem,
    type PeakHoursItem,
    type TopSellingProductItem,
    type KitchenPerformanceItem,
    type StaffPerformanceItem,
} from '@/apis/dashboard.api';

import KPICards from '@/app/admin/dashboard/components/overview/KPICards';
import RevenueChart, { GroupByType } from '@/app/admin/dashboard/components/overview/RevenueChart';
import SalesByChannelChart from '@/app/admin/dashboard/components/overview/SalesByChannelChart';
import PeakHoursChart from '@/app/admin/dashboard/components/overview/PeakHoursChart';
import TopProducts from '@/app/admin/dashboard/components/products/TopProducts';
import KitchenPerformanceChart from '@/app/admin/dashboard/components/operations/KitchenPerformanceChart';
import StaffPerformanceChart from '@/app/admin/dashboard/components/operations/StaffPerformanceChart';

export default function ManagerDashboardV2() {
    // Branch info
    const [branchId, setBranchId] = useState<number | null>(null);
    const [branchName, setBranchName] = useState<string>('');

    // Date range filter
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date()
    });

    // Revenue chart groupBy
    const [revenueGroupBy, setRevenueGroupBy] = useState<GroupByType>('day');

    // Data states
    const [kpis, setKpis] = useState<DashboardKPIItem[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueChartItem[]>([]);
    const [channelData, setChannelData] = useState<RevenueByChannelItem[]>([]);
    const [peakHoursData, setPeakHoursData] = useState<PeakHoursItem[]>([]);
    const [topProductsData, setTopProductsData] = useState<TopSellingProductItem[]>([]);
    const [kitchenData, setKitchenData] = useState<KitchenPerformanceItem[]>([]);
    const [staffData, setStaffData] = useState<StaffPerformanceItem[]>([]);

    // Loading states
    const [loading, setLoading] = useState({
        kpis: true,
        revenueChart: true,
        channelRevenue: true,
        peakHours: true,
        topProducts: true,
        kitchenPerformance: true,
        staffPerformance: true,
    });

    // Get branchId from cookie and fetch branch name
    useEffect(() => {
        const fetchBranchInfo = async () => {
            const branchIdFromCookie = getCookie('branchId');
            if (branchIdFromCookie) {
                const id = parseInt(branchIdFromCookie);
                setBranchId(id);

                try {
                    const branches = await getBranches();
                    const branch = branches.find(b => b.id === id);
                    if (branch) {
                        setBranchName(branch.name);
                    }
                } catch (error) {
                    console.error('Failed to fetch branches:', error);
                }
            }
        };
        fetchBranchInfo();
    }, []);

    // Build filter params
    const buildFilterParams = useCallback((): DashboardFilterParams => {
        const params: DashboardFilterParams = {};
        if (branchId) {
            params.branchId = branchId;
        }
        if (dateRange?.from) {
            params.fromDate = format(dateRange.from, 'yyyy-MM-dd');
        }
        if (dateRange?.to) {
            // If start date equals end date, add 1 day to end date for API call
            const fromDateStr = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
            const toDateStr = format(dateRange.to, 'yyyy-MM-dd');

            if (fromDateStr === toDateStr) {
                const nextDay = new Date(dateRange.to);
                nextDay.setDate(nextDay.getDate() + 1);
                params.toDate = format(nextDay, 'yyyy-MM-dd');
            } else {
                params.toDate = toDateStr;
            }
        }
        return params;
    }, [branchId, dateRange]);

    // Fetch Revenue Chart separately (for groupBy changes) - stable function reference
    const fetchRevenueChart = useCallback(async (groupBy: GroupByType) => {
        if (!branchId) return;

        const params = buildFilterParams();
        setLoading(prev => ({ ...prev, revenueChart: true }));
        try {
            const response = await getRevenueChartData({ ...params, groupBy });
            if (response.data) {
                setRevenueData(response.data);
            }
        } catch (error) {
            console.error('Error fetching revenue chart:', error);
        } finally {
            setLoading(prev => ({ ...prev, revenueChart: false }));
        }
    }, [branchId, buildFilterParams]);

    // Handle groupBy change for revenue chart - stable reference, inline API call
    const handleRevenueGroupByChange = useCallback((groupBy: GroupByType) => {
        setRevenueGroupBy(groupBy);
        // Directly call API to avoid dependency chain issues
        if (!branchId) return;
        const params = buildFilterParams();
        setLoading(prev => ({ ...prev, revenueChart: true }));
        getRevenueChartData({ ...params, groupBy })
            .then(response => {
                if (response.data) {
                    setRevenueData(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching revenue chart:', error);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, revenueChart: false }));
            });
    }, [branchId, buildFilterParams]);

    // Fetch all dashboard data (except revenue chart which has its own fetch)
    const fetchDashboardData = useCallback(async () => {
        if (!branchId) return;

        const params = buildFilterParams();

        // Fetch KPIs
        setLoading(prev => ({ ...prev, kpis: true }));
        try {
            const response = await getDashboardKPIs(params);
            if (response.data) {
                setKpis(response.data);
            }
        } catch (error) {
            console.error('Error fetching KPIs:', error);
        } finally {
            setLoading(prev => ({ ...prev, kpis: false }));
        }

        // Fetch Channel Revenue
        setLoading(prev => ({ ...prev, channelRevenue: true }));
        try {
            const response = await getRevenueByChannel(params);
            if (response.data) {
                const colors = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)'];
                setChannelData(response.data.map((item, index) => ({
                    ...item,
                    fill: colors[index % colors.length]
                })));
            }
        } catch (error) {
            console.error('Error fetching channel revenue:', error);
        } finally {
            setLoading(prev => ({ ...prev, channelRevenue: false }));
        }

        // Fetch Peak Hours
        setLoading(prev => ({ ...prev, peakHours: true }));
        try {
            const response = await getPeakHoursData(params);
            if (response.data) {
                setPeakHoursData(response.data);
            }
        } catch (error) {
            console.error('Error fetching peak hours:', error);
        } finally {
            setLoading(prev => ({ ...prev, peakHours: false }));
        }

        // Fetch Top Products
        setLoading(prev => ({ ...prev, topProducts: true }));
        try {
            const response = await getTopSellingProducts({ ...params, limit: 10 });
            if (response.data) {
                setTopProductsData(response.data);
            }
        } catch (error) {
            console.error('Error fetching top products:', error);
        } finally {
            setLoading(prev => ({ ...prev, topProducts: false }));
        }

        // Fetch Kitchen Performance
        setLoading(prev => ({ ...prev, kitchenPerformance: true }));
        try {
            const response = await getKitchenPerformance(params);
            if (response.data) {
                setKitchenData(response.data);
            }
        } catch (error) {
            console.error('Error fetching kitchen performance:', error);
        } finally {
            setLoading(prev => ({ ...prev, kitchenPerformance: false }));
        }

        // Fetch Staff Performance
        setLoading(prev => ({ ...prev, staffPerformance: true }));
        try {
            const response = await getStaffPerformance(params);
            if (response.data) {
                setStaffData(response.data);
            }
        } catch (error) {
            console.error('Error fetching staff performance:', error);
        } finally {
            setLoading(prev => ({ ...prev, staffPerformance: false }));
        }
    }, [branchId, buildFilterParams]);

    // Fetch all data when branchId or dateRange changes
    useEffect(() => {
        if (branchId) {
            fetchDashboardData();
            fetchRevenueChart(revenueGroupBy);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchId, dateRange, fetchDashboardData, fetchRevenueChart]);

    const handleDateRangeSelect = (range: DateRange | undefined) => {
        setDateRange(range);
    };

    // Memoize loading indicator - exclude revenueChart to prevent UI jitter
    const isInitialLoading = useMemo(() => {
        return loading.kpis || loading.channelRevenue || loading.peakHours ||
            loading.topProducts || loading.kitchenPerformance || loading.staffPerformance;
    }, [loading.kpis, loading.channelRevenue, loading.peakHours,
    loading.topProducts, loading.kitchenPerformance, loading.staffPerformance]);

    // Check if date range is exactly 1 day (same from and to date)
    const isSingleDay = dateRange?.from && dateRange?.to &&
        format(dateRange.from, 'yyyy-MM-dd') === format(dateRange.to, 'yyyy-MM-dd');

    return (
        <ManagerGuard>
            <AdminPageLayout>
                <AdminPageHeader
                    title="Dashboard Chi Nhánh"
                    icon={LayoutDashboard} actions={
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Branch Badge with Loading indicator */}
                            {branchName && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EC6426] text-white shadow-lg shadow-orange-500/20">
                                    {isInitialLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                    )}
                                    <span className="text-sm font-bold tracking-wide">{branchName}</span>
                                </div>
                            )}

                            {/* Date Range Picker */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-medium bg-white/80 border-[#78A243]/30 hover:bg-white hover:border-[#78A243]",
                                            !dateRange && "text-[#2D1E1A]/50"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-[#78A243]" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <span className="text-[#2D1E1A]">
                                                    {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} - {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
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
                                <PopoverContent className="w-auto p-0 bg-white border-[#78A243]/20 shadow-lg rounded-xl" align="end">
                                    <div className="p-3 border-b border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/20 to-[#78A243]/10">
                                        <p className="text-sm font-bold text-[#2D1E1A]">Chọn khoảng thời gian</p>
                                        <p className="text-xs text-[#2D1E1A]/60 mt-1">Nhấn vào ngày bắt đầu và kết thúc</p>
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
                                    <div className="p-3 border-t border-[#78A243]/20 flex gap-2 bg-[#EBD187]/10">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-[#78A243]/30 hover:bg-[#78A243]/10 hover:border-[#78A243]"
                                            onClick={() => {
                                                const today = new Date();
                                                handleDateRangeSelect({ from: today, to: today });
                                            }}
                                        >
                                            Hôm nay
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-[#78A243]/30 hover:bg-[#78A243]/10 hover:border-[#78A243]"
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
                                            className="flex-1 border-[#78A243]/30 hover:bg-[#78A243]/10 hover:border-[#78A243]"
                                            onClick={() => {
                                                const today = new Date();
                                                const thirtyDaysAgo = new Date(today);
                                                thirtyDaysAgo.setDate(today.getDate() - 30);
                                                handleDateRangeSelect({ from: thirtyDaysAgo, to: today });
                                            }}
                                        >
                                            30 ngày
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    }
                />

                {/* KPI Cards */}
                <KPICards kpis={kpis} isLoading={loading.kpis} showTrend={isSingleDay} />

                {/* Charts Section - Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <RevenueChart
                            data={revenueData}
                            isLoading={loading.revenueChart}
                            groupBy={revenueGroupBy}
                            onGroupByChange={handleRevenueGroupByChange}
                        />
                    </div>
                    <div>
                        <SalesByChannelChart data={channelData} isLoading={loading.channelRevenue} />
                    </div>
                </div>

                {/* Charts Section - Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TopProducts data={topProductsData} isLoading={loading.topProducts} />
                    <PeakHoursChart data={peakHoursData} isLoading={loading.peakHours} />
                </div>

                {/* Operations Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <KitchenPerformanceChart data={kitchenData} isLoading={loading.kitchenPerformance} />
                    <StaffPerformanceChart data={staffData} isLoading={loading.staffPerformance} />
                </div>
            </AdminPageLayout>
        </ManagerGuard>
    );
}
