"use client";

import React, { useMemo, memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RevenueChartItem } from "@/apis/dashboard.api";
import { Loader2, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

export type GroupByType = "day" | "week" | "month";

// Helper function to format revenue
const formatRevenue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return `${value}đ`;
};

interface RevenueChartProps {
  data: RevenueChartItem[];
  groupBy: GroupByType;
  onGroupByChange: (groupBy: GroupByType) => void;
  isLoading?: boolean;
}

function RevenueChart({
  data,
  groupBy,
  onGroupByChange,
  isLoading,
}: RevenueChartProps) {
  const hasData = data && data.length > 0 && data.some((d) => d.revenue > 0);

  // Format X-axis label based on groupBy type
  const formatXAxisLabel = (value: string): string => {
    if (!value) return "";

    // Handle different time formats from API
    if (groupBy === "week") {
      // Format: "2024-W01" or week number
      if (value.includes("W")) {
        return value.replace("-W", "/W");
      }
      return `W${value}`;
    }

    if (groupBy === "month") {
      // Format: "2024-01" or "01/2024"
      const parts = value.split("-");
      if (parts.length === 2) {
        return `${parts[1]}/${parts[0]}`;
      }
      return value;
    }

    // Day format: "2024-01-15" or date string
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
    return value;
  };

  // Get subtitle based on groupBy
  const subtitle = useMemo(() => {
    switch (groupBy) {
      case "week":
        return "Biểu đồ doanh thu theo tuần";
      case "month":
        return "Biểu đồ doanh thu theo tháng";
      default:
        return "Biểu đồ doanh thu theo ngày";
    }
  }, [groupBy]);

  // Format tooltip label based on groupBy
  const formatTooltipLabel = (label: string): string => {
    if (!label) return "";

    if (groupBy === "week") {
      return `Tuần ${label}`;
    }
    if (groupBy === "month") {
      return `Tháng ${label}`;
    }

    const date = new Date(label);
    if (!isNaN(date.getTime())) {
      return `Ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return `Ngày ${label}`;
  };

  return (
    <Card className="p-5 rounded-xl bg-white backdrop-blur-sm border-grey-300 border shadow-sm h-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-base font-bold text-[#2D1E1A]">Doanh Thu</h3>
          <p className="text-xs text-[#2D1E1A]/60 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1">
          <select
            title="Group by"
            className="bg-white border border-grey-300 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-grey-300 focus:ring-1 focus:ring-grey-300 text-[#2D1E1A] font-medium"
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value as GroupByType)}
          >
            <option value="day">Theo Ngày</option>
            <option value="week">Theo Tuần</option>
            <option value="month">Theo Tháng</option>
          </select>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-[#EBD187]/10 rounded-lg animate-pulse">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#78A243] mx-auto mb-2" />
              <p className="text-sm text-[#2D1E1A]/60">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : !hasData ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Inbox className="h-12 w-12 text-[#78A243]/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#2D1E1A]/70">
                Chưa có dữ liệu doanh thu
              </p>
              <p className="text-xs text-[#2D1E1A]/50 mt-1">
                Thay đổi bộ lọc hoặc chờ dữ liệu mới
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#78A243" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#78A243" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#78A243"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#2D1E1A", fontSize: 11 }}
                dy={10}
                tickFormatter={formatXAxisLabel}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#2D1E1A", fontSize: 11 }}
                tickFormatter={formatRevenue}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid rgba(120, 162, 67, 0.3)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value: number) => [
                  `₫${value.toLocaleString()}`,
                  "Doanh thu",
                ]}
                labelFormatter={formatTooltipLabel}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#78A243"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export default memo(RevenueChart);
