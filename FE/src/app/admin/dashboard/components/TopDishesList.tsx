'use client';

import { SellingItem } from '@/apis/statistics.api';
import { Card } from '@/components/ui/card';
import { Trophy, Award, Star } from 'lucide-react';
import Link from 'next/link';

interface TopDishesListProps {
    data?: SellingItem[];
    isLoading?: boolean;
}

const rankIcons = [
    <Trophy key="1" size={18} className="text-yellow-500" />,
    <Award key="2" size={18} className="text-gray-400" />,
    <Star key="3" size={18} className="text-orange-400" />,
]

export function TopDishesList({ data = [], isLoading = false }: TopDishesListProps) {
    if (isLoading) {
        return (
            <div className="bg-white/60 backdrop-blur-sm border-white/20 border shadow-sm rounded-2xl h-full flex flex-col p-4 animate-pulse">
                 <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-4"></div>
                 <div className="space-y-2 flex-1">
                    <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
                 </div>
            </div>
        )
    }
    
    const topDishes = data.slice(0, 5);

    return (
        <div className="bg-white/60 backdrop-blur-sm border-white/20 border shadow-sm rounded-2xl h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800">Món bán chạy</h3>
                <Link href="/admin/recipes" className="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                    Xem tất cả
                </Link>
            </div>

            {topDishes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                     <Trophy size={32} className="mb-2 opacity-50"/>
                     <p className="text-sm font-medium">Không có dữ liệu</p>
                </div>
            ) : (
                <div className="space-y-2 flex-1 -mr-2 pr-2 overflow-y-auto">
                    {topDishes.map((dish, index) => (
                        <div
                            key={dish.itemId}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
                        >
                            <div className="flex items-center justify-center w-6 font-bold text-sm text-gray-500">
                                {rankIcons[index] ?? (index + 1)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{dish.itemName}</p>
                            </div>
                            <p className="text-sm font-bold text-orange-600">
                                {dish.quantitySold}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
