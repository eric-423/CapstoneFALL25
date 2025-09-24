'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Star, ShoppingCart } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

export const BestSellersSection: React.FC = () => {
    const featuredProducts = getFeaturedProducts();

    return (
        <section className="py-16 bg-gradient-to-br from-yellow-100 to-orange-200">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        BEST SELLERS
                    </h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-200">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        e.currentTarget.src = '/images/placeholder-food.jpg';
                                    }}
                                />
                                {product.discount && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                                        -{product.discount}%
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 uppercase">
                                    {product.name}
                                </h3>

                                <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                                    {product.description}
                                </p>

                                {/* Price and Rating */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-orange-600">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(product.originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium text-sm transition-colors"
                                >
                                    Thêm
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};