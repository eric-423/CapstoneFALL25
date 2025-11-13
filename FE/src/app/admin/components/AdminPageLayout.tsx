'use client';

import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminPageLayoutProps {
    children: React.ReactNode;
    className?: string;
}

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
}

interface AdminStatsCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
    iconClassName?: string;
}

export const AdminPageLayout = memo(function AdminPageLayout({ children, className = '' }: AdminPageLayoutProps) {
    return (
        <div className={`w-full max-w-full overflow-x-hidden ${className}`}>
            <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {children}
            </div>
        </div>
    );
});

export function AdminPageHeader({ title, description, icon: Icon, actions }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                    {Icon && (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                            <Icon className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                    )}
                    <span className="truncate">{title}</span>
                </h1>
                {description && (
                    <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>
                )}
            </div>
            {actions && (
                <div className="flex-shrink-0 flex flex-wrap gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

export function AdminStatsCard({ 
    title, 
    value, 
    icon: Icon, 
    subtitle, 
    trend,
    className = '',
    iconClassName = ''
}: AdminStatsCardProps) {
    return (
        <div className={`relative overflow-hidden p-4 sm:p-6 bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl group ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#EC6426]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 sm:mb-2 uppercase tracking-wider truncate">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-[#EC6426] transition-colors">
                            {value}
                        </p>
                        {trend && (
                            <div className={`flex items-center gap-1 text-xs font-bold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{trend.isPositive ? '↑' : '↓'}</span>
                                <span>{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#EC6426] to-[#F8A91F] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all flex-shrink-0 ${iconClassName}`}>
                        <Icon className="text-white" size={24} strokeWidth={2.5} />
                    </div>
                )}
            </div>
        </div>
    );
}

export function AdminStatsGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {children}
        </div>
    );
}

