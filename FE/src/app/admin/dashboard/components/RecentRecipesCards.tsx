'use client';

import React from 'react';
import { BookOpen, Flame, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Recipe {
    id: number;
    name: string;
    calories: number;
    price: number;
    image: string;
    createdAt: string;
}

interface RecentRecipesCardsProps {
    data: Recipe[];
}

export function RecentRecipesCards({ data }: RecentRecipesCardsProps) {
    return (
        <div className="bg-white/60 backdrop-blur-sm border-white/20 border shadow-sm rounded-2xl h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800">Công thức mới</h3>
                <Link href="/admin/recipes" className="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                    Xem tất cả
                </Link>
            </div>
            <div className="space-y-3 flex-1 -mr-2 pr-2 overflow-y-auto">
                {data.map((recipe) => (
                    <div key={recipe.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400/50 to-orange-500/50 rounded-lg flex items-center justify-center shadow-sm">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{recipe.name}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Flame size={12} />
                                    <span>{recipe.calories} cal</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign size={12} />
                                    <span>{recipe.price.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 self-start pt-1">{recipe.createdAt}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
