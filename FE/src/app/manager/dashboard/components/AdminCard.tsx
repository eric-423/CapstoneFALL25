import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

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
    <Card className="p-2 rounded-xl bg-[#FDE3CF]/90 backdrop-blur-sm border-white/20 border shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 h-25 items-center justify-center">
      <div className="flex items-center gap-2 h-12">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-600 truncate leading-tight">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 font-medium truncate leading-tight mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {value}
          </h3>
          {trend && typeof trend.value === "number" && (
            <div
              className={`flex items-center justify-end gap-0.5 text-xs font-bold mt-0.5 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
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
      </div>
    </Card>
  );
}
