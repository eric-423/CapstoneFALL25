"use client";

import React, { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { TopSellingProductItem } from "@/apis/dashboard.api";
import { Loader2, Inbox, ScatterChart as ScatterIcon } from "lucide-react";

interface ProductPerformanceChartProps {
  data: TopSellingProductItem[];
  isLoading?: boolean;
}

export default function ProductPerformanceChart({
  data,
  isLoading,
}: ProductPerformanceChartProps) {
  const hasData =
    data &&
    data.length > 0 &&
    data.some((d) => d.totalRevenue > 0 || d.quantitySold > 0);

  const yDomain = useMemo(() => {
    if (!data || data.length === 0) {
      return [0, 10000000];
    }
    const maxRevenue = Math.max(...data.map((d) => d.totalRevenue || 0));
    if (maxRevenue === 0) {
      return [0, 10000000];
    }
    return [0, Math.ceil(maxRevenue * 1.1)];
  }, [data]);

  const xDomain = useMemo(() => {
    if (!data || data.length === 0) {
      return [0, 100];
    }
    const maxQuantity = Math.max(...data.map((d) => d.quantitySold || 0));
    if (maxQuantity === 0) {
      return [0, 100];
    }
    return [0, Math.ceil(maxQuantity * 1.1)];
  }, [data]);

  return (
    <div className="bg-white backdrop-blur-sm p-6 rounded-xl shadow-sm border border-grey-300 h-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-2 rounded-lg bg-[#DA7339]/10">
          <ScatterIcon className="h-4 w-4 text-[#DA7339]" />
        </div>
        <h3 className="text-lg font-semibold text-[#2D1E1A]">
          Hiệu Suất Sản Phẩm
        </h3>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />
        )}
      </div>
      <p className="text-sm text-[#2D1E1A]/60 mb-6">
        Tương quan giữa Số lượng bán và Doanh thu
      </p>

      <div className="h-[350px] w-full">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EBD187]/10 to-[#78A243]/5 rounded-lg animate-pulse">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#78A243] mx-auto mb-2" />
              <p className="text-sm text-[#2D1E1A]/60">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : !hasData ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#EBD187]/30 to-[#78A243]/10 flex items-center justify-center mb-3">
                <Inbox className="h-8 w-8 text-[#78A243]/60" />
              </div>
              <p className="text-sm font-medium text-[#2D1E1A]/70">
                Chưa có dữ liệu hiệu suất
              </p>
              <p className="text-xs text-[#2D1E1A]/50 mt-1">
                Biểu đồ tương quan sẽ hiển thị tại đây
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#78A243"
                strokeOpacity={0.2}
              />
              <XAxis
                type="number"
                dataKey="quantitySold"
                name="Số lượng"
                unit=" món"
                domain={xDomain}
                label={{
                  value: "Số lượng bán",
                  position: "bottom",
                  offset: 0,
                  fill: "#2D1E1A",
                  fontSize: 12,
                  fillOpacity: 0.6,
                }}
                tick={{ fill: "#2D1E1A", fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="totalRevenue"
                name="Doanh thu"
                domain={yDomain}
                label={{
                  value: "Doanh thu",
                  angle: -90,
                  position: "left",
                  offset: 0,
                  fill: "#2D1E1A",
                  fontSize: 12,
                  fillOpacity: 0.6,
                }}
                tick={{ fill: "#2D1E1A", fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <ZAxis type="number" dataKey="quantitySold" range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/95 backdrop-blur-sm border border-[#78A243]/20 p-3 rounded-lg shadow-lg">
                        <p className="font-semibold text-[#2D1E1A] mb-1">
                          {data.productName}
                        </p>
                        <p className="text-sm text-[#2D1E1A]/60">
                          Bán: {data.quantitySold}
                        </p>
                        <p className="text-sm text-[#78A243] font-medium">
                          Thu: ₫{data.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Products" data={data} fill="#DA7339" />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
