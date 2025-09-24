'use client';

import React from 'react';
import Image from 'next/image';

const features = [
    {
        title: 'NGUYÊN LIỆU TƯƠI NGON - AN TOÀN',
        image: '/images/why-1.svg'
    },
    {
        title: 'CÔNG THỨC LỚP ĐỘC QUYỀN, NGON CHUẨN VỊ',
        image: '/images/why-2.svg'
    },
    {
        title: 'GIÁ CẢ PHẢI CHĂNG',
        image: '/images/why-3.svg'
    }
];

export const WhyChooseSection: React.FC = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        TẠI SAO CHỌN CƠM <span className="text-orange-500">TÂM</span><span className='text-green-500'> TẮC</span>?
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            {/* Feature Image */}
                            <div className="mb-6 relative overflow-hidden rounded-2xl shadow-lg bg-white">
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        priority={index === 0}
                                        onError={(e) => {
                                            // Fallback to placeholder if image fails to load
                                            e.currentTarget.src = '/images/placeholder-food.jpg';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Feature Content */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                                    {feature.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};