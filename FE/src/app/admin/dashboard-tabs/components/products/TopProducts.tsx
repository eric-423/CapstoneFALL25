import React from 'react';
import { ProductSummary } from '../../types';

interface TopProductsProps {
    data: ProductSummary[];
}

export default function TopProducts({ data }: TopProductsProps) {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-foreground">Top Món Bán Chạy</h3>
                <button className="text-sm text-primary hover:underline">Xem tất cả</button>
            </div>

            <div className="space-y-4">
                {data.map((product) => (
                    <div key={product.productId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            {/* Placeholder for image */}
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                IMG
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate">{product.productName}</h4>
                            <p className="text-xs text-muted-foreground">{product.quantitySold} đã bán</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">
                                ₫{(product.totalRevenue / 1000000).toFixed(1)}M
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
