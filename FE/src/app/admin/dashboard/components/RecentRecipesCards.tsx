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
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Công thức mới nhất</h3>
                <Link
                    href="/admin/recipes"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                    Xem tất cả →
                </Link>
            </div>
            <div className="space-y-4">
                {data.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-white hover:from-orange-100 transition-all cursor-pointer border border-orange-100"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{recipe.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    <span>{recipe.calories} cal</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    <span>{recipe.price.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">{recipe.createdAt}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
