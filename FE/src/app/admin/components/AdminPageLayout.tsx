"use client";

import React, { memo } from "react";
import { LucideIcon } from "lucide-react";

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

export const AdminPageLayout = memo(function AdminPageLayout({
  children,
  className = "",
}: AdminPageLayoutProps) {
  return (
    <div className={`w-full max-w-full overflow-x-hidden ${className}`}>
      <div className="w-full max-w-[1800px] mx-auto space-y-4">{children}</div>
    </div>
  );
});

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex-1 min-w-0 ml-4">
        <div className="flex items-center gap-3 ">
          {Icon && <Icon className="w-7 h-7 text-gray-500 flex-shrink-0" />}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate ">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-1 sm:ml-10">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex-shrink-0 flex items-center flex-wrap gap-2">
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
  className = "",
  iconClassName = "",
}: AdminStatsCardProps) {
  return (
    <div
      className={`relative overflow-hidden p-3 bg-[#FDE3CF]/70 border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#EC6426]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#EC6426] transition-colors">
              {value}
            </p>
            {trend && (
              <div
                className={`flex items-center gap-1 text-xs font-bold ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                <span>{trend.isPositive ? "↑" : "↓"}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        {Icon && <Icon className="text-brown" size={20} strokeWidth={2.5} />}
      </div>
    </div>
  );
}

export function AdminStatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {children}
    </div>
  );
}
