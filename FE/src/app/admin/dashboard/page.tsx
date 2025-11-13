'use client';

import { DollarSign, ShoppingCart, Store, Users, TrendingUp, Package, BookOpen, GraduationCap, AlertTriangle, Activity, Clock, CheckCircle, TrendingDown, Zap } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { RevenueChart } from './components/RevenueChart';
import { TopDishesChart } from './components/TopDishesChart';
import { RecentOrdersTable } from './components/RecentOrdersTable';
import { IngredientUsageChart } from './components/IngredientUsageChart';
import { SupplierDistributionChart } from './components/SupplierDistributionChart';
import { RecentRecipesCards } from './components/RecentRecipesCards';
import { TrainingStatusCard } from './components/TrainingStatusCard';
import { AlertsPanel } from './components/AlertsPanel';
import { ActivitiesTimeline } from './components/ActivitiesTimeline';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { useEffect, useState } from 'react';
import {
    getRevenueStatistics,
    getOrderCountStatistics,
    getNewCustomerStatistics,
    getServiceTimeStatistics,
    getRevenue7Days,
    getTopMaterials,
    getTopSellingItems,
    type RevenueStatistics,
    type OrderCountStatistics,
    type NewCustomerStatistics,
    type ServiceTimeStatistics,
    type Revenue7Days as Revenue7DaysType,
    type TopMaterials,
    type TopSellingItems,
} from '@/apis/statistics.api';
import {
    kpiData,
    revenueData,
    topDishesData,
    recentOrders,
    ingredientUsageData,
    supplierDistributionData,
    recentRecipesData,
    trainingStatsData,
    recentActivitiesData,
    lowStockAlertsData,
} from './mockData';

export default function DashboardPage() {
    const { selectedBranch, timePeriod, dateRange } = useAdminContext();
    const [isLoading, setIsLoading] = useState(false);
    const lowStockCount = lowStockAlertsData.length;

    // Statistics state
    const [revenueStats, setRevenueStats] = useState<RevenueStatistics | null>(null);
    const [orderCountStats, setOrderCountStats] = useState<OrderCountStatistics | null>(null);
    const [newCustomerStats, setNewCustomerStats] = useState<NewCustomerStatistics | null>(null);
    const [serviceTimeStats, setServiceTimeStats] = useState<ServiceTimeStatistics | null>(null);
    const [revenue7DaysData, setRevenue7DaysData] = useState<Revenue7DaysType | null>(null);
    const [topMaterialsData, setTopMaterialsData] = useState<TopMaterials | null>(null);
    const [topSellingData, setTopSellingData] = useState<TopSellingItems | null>(null);

    // Mock F&B KPIs - in real app, fetch from API based on branch/time filters
    const [operationalKPIs, setOperationalKPIs] = useState({
        avgServiceTime: 12.5, // minutes
        slaCompliance: 94.2, // percentage
        trainingCompletion: 87.5, // percentage
        criticalAlerts: 3,
        peakHourEfficiency: 89.3, // percentage
        wastePercentage: 4.2, // percentage
    });

    // Refetch data when filters change
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const branchId = selectedBranch?.id ? parseInt(selectedBranch.id) : 1; // Default to branch 1 if none selected
                const branchIdOrUndefined = selectedBranch?.id ? parseInt(selectedBranch.id) : undefined;

                // Fetch all statistics in parallel
                const [revenue, orderCount, newCustomers, serviceTime, revenue7Days, topMaterials, topSelling] = await Promise.all([
                    getRevenueStatistics(branchId),
                    getOrderCountStatistics(branchId),
                    getNewCustomerStatistics('DAILY'),
                    getServiceTimeStatistics(branchId),
                    getRevenue7Days(branchIdOrUndefined), // Pass undefined if no branch selected for total
                    getTopMaterials(branchIdOrUndefined, 5),
                    getTopSellingItems(branchIdOrUndefined, 5),
                ]);

                setRevenueStats(revenue);
                setOrderCountStats(orderCount);
                setNewCustomerStats(newCustomers);
                setServiceTimeStats(serviceTime);
                setRevenue7DaysData(revenue7Days);
                setTopMaterialsData(topMaterials);
                setTopSellingData(topSelling);

                // Update operational KPIs from service time stats
                if (serviceTime) {
                    setOperationalKPIs(prev => ({
                        ...prev,
                        avgServiceTime: serviceTime.averageServiceTimeMinutes,
                        slaCompliance: serviceTime.averageServiceTimeMinutes < 15 ? 94.2 : 87.5,
                    }));
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedBranch, timePeriod, dateRange]);

    const getTimePeriodLabel = () => {
        switch (timePeriod) {
            case 'today': return 'Hôm nay';
            case '7d': return '7 ngày qua';
            case '30d': return '30 ngày qua';
            case 'custom': return dateRange ? 'Tùy chỉnh' : 'Tùy chỉnh';
            default: return 'Hôm nay';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-[1800px] mx-auto space-y-4">
                {/* Header - Compact */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent mb-1">
                            {selectedBranch ? selectedBranch.name : 'Tổng quan hệ thống'}
                        </h1>
                        <p className="text-gray-600 text-sm">
                            {getTimePeriodLabel()}
                            {isLoading && <span className="ml-2 text-xs text-orange-500">Đang tải...</span>}
                        </p>
                    </div>
                    <div className="text-xs text-gray-500">
                        {new Date().toLocaleString('vi-VN')}
                    </div>
                </div>

                {/* ROW 1: KPI Overview - Compact 6 cards in 1 row */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#EC6426]" />
                        <h2 className="text-base font-semibold text-gray-800">Chỉ số hoạt động</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <DashboardCard
                            title="Doanh thu hôm nay"
                            value={revenueStats ? `${revenueStats.totalRevenue.toLocaleString('vi-VN')}đ` : kpiData.revenueToday.value}
                            icon={DollarSign}
                            trend={kpiData.revenueToday.trend}
                            subtitle={revenueStats ? `${revenueStats.totalOrders} đơn` : kpiData.revenueToday.subtitle}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Tổng đơn hàng"
                            value={orderCountStats ? orderCountStats.totalOrders : kpiData.totalOrders.value}
                            icon={ShoppingCart}
                            trend={kpiData.totalOrders.trend}
                            subtitle={orderCountStats ? `${orderCountStats.shippingOrders + orderCountStats.pickupOrders + orderCountStats.diningOrders} đơn` : kpiData.totalOrders.subtitle}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Chi nhánh"
                            value={kpiData.activeBranches.value}
                            icon={Store}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Khách hàng mới"
                            value={newCustomerStats ? newCustomerStats.newCustomersToday : kpiData.newCustomers.value}
                            icon={Users}
                            trend={newCustomerStats ? {
                                value: Math.abs(newCustomerStats.percentageChange),
                                isPositive: newCustomerStats.percentageChange >= 0
                            } : kpiData.newCustomers.trend}
                            subtitle={newCustomerStats ? `${newCustomerStats.difference > 0 ? '+' : ''}${newCustomerStats.difference}` : kpiData.newCustomers.subtitle}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Cảnh báo kho"
                            value={lowStockCount}
                            icon={AlertTriangle}
                            subtitle="Cần nhập"
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Đào tạo"
                            value={`${trainingStatsData.completionRate}%`}
                            icon={GraduationCap}
                            subtitle="Hoàn thành"
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* ROW 2: F&B Operational KPIs - Compact */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-[#EC6426]" />
                        <h2 className="text-base font-semibold text-gray-800">KPI Vận hành</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <DashboardCard
                            title="Thời gian phục vụ TB"
                            value={serviceTimeStats ? `${serviceTimeStats.averageServiceTimeMinutes.toFixed(1)}p` : `${operationalKPIs.avgServiceTime.toFixed(1)}p`}
                            icon={Clock}
                            trend={serviceTimeStats ? {
                                value: Math.abs(serviceTimeStats.percentageChange),
                                isPositive: serviceTimeStats.percentageChange <= 0
                            } : {
                                value: 2.1,
                                isPositive: operationalKPIs.avgServiceTime < 15
                            }}
                            subtitle={serviceTimeStats ? `${serviceTimeStats.totalOrdersProcessed} đơn` : (operationalKPIs.avgServiceTime < 15 ? 'Đạt chuẩn' : 'Cải thiện')}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="SLA Phục vụ"
                            value={`${operationalKPIs.slaCompliance.toFixed(1)}%`}
                            icon={CheckCircle}
                            trend={{
                                value: operationalKPIs.slaCompliance >= 90 ? 1.2 : 2.3,
                                isPositive: operationalKPIs.slaCompliance >= 90
                            }}
                            subtitle={operationalKPIs.slaCompliance >= 90 ? 'Đạt chuẩn' : 'Dưới mục tiêu'}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Cảnh báo ưu tiên"
                            value={operationalKPIs.criticalAlerts}
                            icon={AlertTriangle}
                            subtitle="Xử lý ngay"
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* ROW 3: Analytics Charts - 2x2 Grid */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-[#EC6426]" />
                        <h2 className="text-base font-semibold text-gray-800">Phân tích</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <RevenueChart data={revenue7DaysData ?
                            revenue7DaysData.dailyRevenues.map((item) => ({
                                date: item.date,
                                revenue: item.revenue
                            }))
                            : revenueData}
                        />
                        <TopDishesChart data={topDishesData} />
                        <IngredientUsageChart data={ingredientUsageData} />
                        <SupplierDistributionChart data={supplierDistributionData} />
                    </div>
                </div>

                {/* ROW 4: 3-column layout - Recipe, Training, Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-[#EC6426]" />
                            <h2 className="text-base font-semibold text-gray-800">Công thức</h2>
                        </div>
                        <RecentRecipesCards data={recentRecipesData} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-4 h-4 text-[#EC6426]" />
                            <h2 className="text-base font-semibold text-gray-800">Đào tạo</h2>
                        </div>
                        <TrainingStatusCard data={trainingStatsData} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-[#EC6426]" />
                            <h2 className="text-base font-semibold text-gray-800">Hoạt động</h2>
                        </div>
                        <ActivitiesTimeline activities={recentActivitiesData} />
                    </div>
                </div>

                {/* ROW 5: Alerts Panel */}
                <div>
                    <AlertsPanel alerts={lowStockAlertsData} />
                </div>

                {/* Recent Orders Table */}
                <div>
                    <RecentOrdersTable orders={recentOrders} />
                </div>
            </div>
        </div>
    );
}
