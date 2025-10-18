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
import { ScopeInfoBanner } from './components/ScopeInfoBanner';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { useEffect, useState } from 'react';
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
            // TODO: Implement real API calls
            // const data = await fetch(`/api/dashboard?branch=${selectedBranch?.id}&period=${timePeriod}`);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock: adjust data based on branch/time
            if (selectedBranch) {
                setOperationalKPIs(prev => ({
                    ...prev,
                    avgServiceTime: prev.avgServiceTime * (Math.random() * 0.3 + 0.85),
                    slaCompliance: Math.min(100, prev.slaCompliance * (Math.random() * 0.1 + 0.95)),
                }));
            }

            setIsLoading(false);
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
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#EC6426] to-[#F8A91F] bg-clip-text text-transparent mb-2">
                            {selectedBranch ? selectedBranch.name : 'Tổng quan hệ thống'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Dashboard quản trị & phân tích dữ liệu • {getTimePeriodLabel()}
                            {isLoading && <span className="ml-2 text-sm text-orange-500">Đang tải...</span>}
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Cập nhật: {new Date().toLocaleString('vi-VN')}
                    </div>
                </div>

                {/* Scope Info Banner */}
                <ScopeInfoBanner />

                {/* ROW 1: KPI Overview (6 cards - 2 rows of 3) */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">Chỉ số hoạt động</h2>
                    </div>
                    {/* First row - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <DashboardCard
                            title="Doanh thu hôm nay"
                            value={kpiData.revenueToday.value}
                            icon={DollarSign}
                            trend={kpiData.revenueToday.trend}
                            subtitle={kpiData.revenueToday.subtitle}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Tổng đơn hàng"
                            value={kpiData.totalOrders.value}
                            icon={ShoppingCart}
                            trend={kpiData.totalOrders.trend}
                            subtitle={kpiData.totalOrders.subtitle}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Chi nhánh hoạt động"
                            value={kpiData.activeBranches.value}
                            icon={Store}
                            isLoading={isLoading}
                        />
                    </div>
                    {/* Second row - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DashboardCard
                            title="Khách hàng mới"
                            value={kpiData.newCustomers.value}
                            icon={Users}
                            trend={kpiData.newCustomers.trend}
                            subtitle={kpiData.newCustomers.subtitle}
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Nguyên liệu sắp hết"
                            value={lowStockCount}
                            icon={AlertTriangle}
                            subtitle="Cần nhập hàng"
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Tỷ lệ hoàn thành"
                            value={`${trainingStatsData.completionRate}%`}
                            icon={GraduationCap}
                            subtitle="Đào tạo nhân viên"
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* ROW 1.5: F&B Operational KPIs */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">KPI Vận hành F&B</h2>
                        <span className="ml-auto text-sm text-gray-500">Real-time monitoring</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DashboardCard
                            title="Thời gian phục vụ TB"
                            value={`${operationalKPIs.avgServiceTime.toFixed(1)} phút`}
                            icon={Clock}
                            trend={{
                                value: 2.1,
                                isPositive: operationalKPIs.avgServiceTime < 15
                            }}
                            subtitle={operationalKPIs.avgServiceTime < 15 ? 'Trong mục tiêu' : 'Cần cải thiện'}
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
                            subtitle="Cần xử lý ngay"
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* ROW 2: Analytics Charts */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">Phân tích bếp & Doanh thu</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <RevenueChart data={revenueData} />
                        <IngredientUsageChart data={ingredientUsageData} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TopDishesChart data={topDishesData} />
                        <SupplierDistributionChart data={supplierDistributionData} />
                    </div>
                </div>

                {/* ROW 3: Recipe & Training Overview */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">Công thức & Đào tạo</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <RecentRecipesCards data={recentRecipesData} />
                        </div>
                        <div>
                            <TrainingStatusCard data={trainingStatsData} />
                        </div>
                    </div>
                </div>

                {/* ROW 4: Alerts + Recent Activities */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-[#EC6426]" />
                        <h2 className="text-xl font-semibold text-gray-800">Cảnh báo & Hoạt động</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AlertsPanel alerts={lowStockAlertsData} />
                        <ActivitiesTimeline activities={recentActivitiesData} />
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div>
                    <RecentOrdersTable orders={recentOrders} />
                </div>
            </div>
        </div>
    );
}
