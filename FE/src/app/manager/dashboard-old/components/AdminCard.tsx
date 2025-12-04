import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Info } from "lucide-react";

interface AdminCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  isLoading?: boolean;
}

export function AdminCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  isLoading = false,
}: AdminCardProps) {
  if (isLoading) {
    return (
      <Card className="p-2 rounded-xl bg-white/60">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-7 h-7 rounded-lg bg-gray-200"></div>
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded-md w-1/2"></div>
          </div>
          <div className="w-1/4 space-y-1">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 rounded-xl bg-white border shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative w-full min-w-0">
        <div className="flex items-center justify-between mb-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-gray-400" strokeWidth={2} />
            </div>
            <p className="text-sm font-semibold text-gray-700 truncate min-w-0">
              {title}
            </p>
          </div>
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <Info size={16} className="text-gray-300" strokeWidth={2} />
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 leading-tight truncate min-w-0 flex-1">
            {value}
          </h3>
          {trend && typeof trend.value === "number" && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                trend.isPositive
                  ? "text-green-600 bg-green-50"
                  : "text-red-600 bg-red-50"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-2 truncate">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}
