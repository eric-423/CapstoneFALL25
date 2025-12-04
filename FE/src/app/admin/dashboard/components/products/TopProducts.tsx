import React from 'react';
import Image from 'next/image';
import { TopSellingProductItem } from '@/apis/dashboard.api';
import { Loader2, Inbox, TrendingUp } from 'lucide-react';

interface TopProductsProps {
    data: TopSellingProductItem[];
    isLoading?: boolean;
}

export default function TopProducts({ data, isLoading }: TopProductsProps) {
    return (
        <div className="bg-gradient-to-br from-white/80 to-[#EBD187]/10 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-[#78A243]/20 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#78A243]/10">
                        <TrendingUp className="h-4 w-4 text-[#78A243]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2D1E1A]">Top Món Bán Chạy</h3>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#78A243]" />}
                </div>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 min-h-0 pr-2 scrollbar-thin scrollbar-thumb-[#78A243]/20 scrollbar-track-transparent">
                {isLoading ? (
                    // Skeleton loading
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg animate-pulse bg-[#EBD187]/10">
                            <div className="w-12 h-12 bg-[#78A243]/10 rounded-md flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[#78A243]/10 rounded w-3/4" />
                                <div className="h-3 bg-[#78A243]/10 rounded w-1/2" />
                            </div>
                            <div className="h-4 bg-[#78A243]/10 rounded w-16" />
                        </div>
                    ))
                ) : !data || data.length === 0 ? (
                    // Empty state
                    <div className="flex-1 flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#EBD187]/30 to-[#78A243]/10 flex items-center justify-center mb-3">
                                <Inbox className="h-8 w-8 text-[#78A243]/60" />
                            </div>
                            <p className="text-sm font-medium text-[#2D1E1A]/70">Chưa có sản phẩm</p>
                            <p className="text-xs text-[#2D1E1A]/50 mt-1">Dữ liệu sản phẩm bán chạy sẽ hiển thị tại đây</p>
                        </div>
                    </div>
                ) : data.map((product, index) => (
                    <div key={product.productId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#78A243]/5 transition-colors border border-transparent hover:border-[#78A243]/10">
                        <div className="relative">
                            <div className="w-12 h-12 bg-[#EBD187]/20 rounded-md overflow-hidden flex-shrink-0 relative border border-[#78A243]/10">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.productName}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#EBD187]/30 to-[#78A243]/10 flex items-center justify-center text-xs text-[#2D1E1A]/50">
                                        IMG
                                    </div>
                                )}
                            </div>
                            {index < 3 && (
                                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                                    ${index === 0 ? 'bg-[#DA7339]' : index === 1 ? 'bg-[#78A243]' : 'bg-[#EBD187] text-[#2D1E1A]'}`}>
                                    {index + 1}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[#2D1E1A] truncate">{product.productName}</h4>
                            <p className="text-xs text-[#2D1E1A]/60">{product.quantitySold} đã bán</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[#78A243]">
                                {product.totalRevenue >= 1000000
                                    ? `${(product.totalRevenue / 1000000).toFixed(1)}M`
                                    : product.totalRevenue >= 1000
                                        ? `${(product.totalRevenue / 1000).toFixed(0)}K`
                                        : `${product.totalRevenue.toLocaleString()}đ`
                                }
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
