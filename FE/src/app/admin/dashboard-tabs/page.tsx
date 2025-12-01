"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FilterDropdown } from '@/app/admin/components/FilterDropdown';
import { BranchesLoader } from '@/app/admin/components/BranchesLoader';
import { useAdminContext } from "@/utils/contexts/AdminContext";

// Data Imports
import {
    overviewKpis, revenueSeries, channelRevenue, peakHours,
    topProducts, comboPerformance,
    promotionPerformance, voucherRevenue,
    kitchenPerformance, staffPerformance, orderFlow
} from './data';

// Component Imports
import KPICards from './components/overview/KPICards';
import RevenueChart from './components/overview/RevenueChart';
import SalesByChannelChart from './components/overview/SalesByChannelChart';
import PeakHoursChart from './components/overview/PeakHoursChart';

import TopProducts from './components/products/TopProducts';
import ProductPerformanceChart from './components/products/ProductPerformanceChart';
import ComboEffectivenessChart from './components/products/ComboEffectivenessChart';

import PromotionPerformanceChart from './components/marketing/PromotionPerformanceChart';
import VoucherRevenueChart from './components/marketing/VoucherRevenueChart';

import KitchenPerformanceChart from './components/operations/KitchenPerformanceChart';
import StaffPerformanceChart from './components/operations/StaffPerformanceChart';
import OrderFlowChart from './components/operations/OrderFlowChart';

export default function DashboardTabsPage() {
    // Global Filters State
    const { branches } = useAdminContext();
    const [selectedBranch, setSelectedBranch] = useState<string>("all");
    const [date, setDate] = useState<Date | undefined>(new Date());

    const handleBranchChange = (value: string) => {
        console.log("Global Filter - Branch changed:", value);
        setSelectedBranch(value);
    };

    const handleDateSelect = (newDate: Date | undefined) => {
        console.log("Global Filter - Date changed:", newDate);
        setDate(newDate);
    };

    return (
        <div className="p-6 space-y-6 bg-background min-h-screen">
            <BranchesLoader />
            {/* HEADER & GLOBAL FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Tổng quan hiệu quả kinh doanh & vận hành</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Branch Filter */}
                    <FilterDropdown
                        label="Chi nhánh"
                        items={[
                            { value: "all", label: "Toàn hệ thống" },
                            ...branches.map((b: any) => ({ value: b.id.toString(), label: b.name }))
                        ]}
                        value={selectedBranch}
                        onChange={handleBranchChange}
                        className="w-[200px]"
                    />

                    {/* Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* TABS LAYOUT */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="products">Sản phẩm</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger value="operations">Vận hành</TabsTrigger>
                </TabsList>

                {/* TAB 1: OVERVIEW */}
                <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-500">
                    <KPICards kpis={overviewKpis} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-[400px]">
                            <RevenueChart data={revenueSeries} />
                        </div>
                        <div className="h-[400px]">
                            <SalesByChannelChart data={channelRevenue} />
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <PeakHoursChart data={peakHours} />
                    </div>
                </TabsContent>

                {/* TAB 2: PRODUCTS */}
                <TabsContent value="products" className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-[450px]">
                            <ProductPerformanceChart data={topProducts} />
                        </div>
                        <div className="h-[450px]">
                            <TopProducts data={topProducts} />
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <ComboEffectivenessChart data={comboPerformance} />
                    </div>
                </TabsContent>

                {/* TAB 3: MARKETING */}
                <TabsContent value="marketing" className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-[400px]">
                            <PromotionPerformanceChart data={promotionPerformance} />
                        </div>
                        <div className="h-[400px]">
                            <VoucherRevenueChart data={voucherRevenue} />
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 4: OPERATIONS */}
                <TabsContent value="operations" className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-[400px]">
                            <KitchenPerformanceChart data={kitchenPerformance} />
                        </div>
                        <div className="h-[400px]">
                            <StaffPerformanceChart data={staffPerformance} />
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <OrderFlowChart data={orderFlow} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
