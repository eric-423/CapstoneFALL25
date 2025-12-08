import React, { memo } from "react";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Inbox,
} from "lucide-react";
import { DashboardKPIItem } from "@/apis/dashboard.api";
import { Card } from "@/components/ui/card";

interface KPICardsProps {
  kpis: DashboardKPIItem[];
  isLoading?: boolean;
  showTrend?: boolean;
}

const TrendIndicator = ({ kpi }: { kpi: DashboardKPIItem }) => {
  const getTrendConfig = () => {
    switch (kpi.trend) {
      case "UP":
        return {
          icon: TrendingUp,
          color: "text-[#78A243]",
          bgColor: "bg-[#78A243]/10",
        };
      case "DOWN":
        return {
          icon: TrendingDown,
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      case "FLAT":
        return {
          icon: Minus,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
        };
      default:
        return {
          icon: TrendingUp,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
        };
    }
  };

  const { icon: TrendIcon, color } = getTrendConfig();
  const percentValue = Math.abs(kpi.percentChange);

  return (
    <div className={`flex items-center gap-1.5`}>
      <TrendIcon size={16} className={color} strokeWidth={2.5} />
      <span className={`text-xs font-semibold ${color}`}>
        {percentValue > 0 ? `${percentValue.toFixed(1)}%` : "0%"}
      </span>
    </div>
  );
};

const KPICard = ({
  kpi,
  showTrend,
}: {
  kpi: DashboardKPIItem;
  showTrend?: boolean;
}) => {
  const isUp = kpi.trend === "UP";
  const trendColor = isUp
    ? "text-[#78A243]"
    : kpi.trend === "DOWN"
      ? "text-red-600"
      : "text-gray-500";
  const TrendIcon = isUp ? ArrowUp : kpi.trend === "DOWN" ? ArrowDown : Minus;

  return (
    <Card className="p-4 rounded-xl bg-white border-gray-300 border shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-[#2D1E1A]/70">{kpi.label}</p>
          <TrendIndicator kpi={kpi} />
        </div>
        <h3 className="text-2xl font-bold text-[#2D1E1A]">
          {typeof kpi.value === "number"
            ? kpi.value.toLocaleString()
            : kpi.value}{" "}
          {kpi.unit}
        </h3>
        {showTrend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`flex items-center text-sm font-semibold ${trendColor}`}
            >
              <TrendIcon size={14} className="mr-0.5" />
              {Math.abs(kpi.percentChange)}%
            </span>
            <span className="text-[#2D1E1A]/50 text-xs">so với hôm qua</span>
          </div>
        )}
      </div>
    </Card>
  );
};

function KPICards({ kpis, isLoading, showTrend }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="p-4 rounded-xl bg-white border-gray-300 border animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#EBD187]/30 rounded w-20" />
                <div className="h-7 bg-[#EBD187]/40 rounded w-28" />
                {showTrend && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-4 bg-[#78A243]/20 rounded w-12" />
                    <div className="h-3 bg-[#EBD187]/30 rounded w-16" />
                  </div>
                )}
              </div>
              <div className="w-10 h-10 bg-[#EBD187]/30 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!kpis || kpis.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="p-6 rounded-xl bg-white border-gray-300 border flex flex-col items-center justify-center min-h-[100px]"
          >
            <Inbox className="h-8 w-8 text-[#78A243]/40 mb-2" />
            <p className="text-sm text-[#2D1E1A]/50 font-medium">
              Chưa có dữ liệu
            </p>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} kpi={kpi} showTrend={showTrend} />
      ))}
    </div>
  );
}

export default memo(KPICards);
