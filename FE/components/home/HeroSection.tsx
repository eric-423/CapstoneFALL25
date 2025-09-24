'use client';

import React from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative min-h-[80vh] bg-cover bg-center bg-no-repeat flex items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/images/hero-bg.jpg')`,
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                {/* Main Title */}
                <div className="mb-8 space-y-2">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#EFE6DB] mb-2">
                        Cơm Tấm Tắc
                    </h1>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#EFE6DB] mb-4">
                        Tắm ngon, Tắc nhớ!
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-[#EFE6DB] font-medium">
                        Thương hiệu cơm tấm hàng đầu dành cho sinh viên
                    </p>
                </div>

                {/* Search Section */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-[#EFE6DB] rounded-lg p-4 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                            {/* Branch Selection */}
                            <div className="relative">
                                <select className="w-full p-3 bg-transparent border border-[#2D1E1A] rounded-md text-[#2D1E1A] focus:outline-none focus:ring-2 focus:ring-[#DA7339] appearance-none">
                                    <option value="">Chọn chi nhánh</option>
                                    <option value="q1">Quận 1</option>
                                    <option value="q3">Quận 3</option>
                                    <option value="q7">Quận 7</option>
                                    <option value="thu-duc">Thủ Đức</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#2D1E1A] pointer-events-none" />
                            </div>

                            {/* Search Input */}
                            <div className="md:col-span-2 relative">
                                <input
                                    type="text"
                                    placeholder="Thương hiệu sản phẩm"
                                    className="w-full p-3 bg-transparent border border-[#2D1E1A] rounded-md text-[#2D1E1A] placeholder-[#DA7339] focus:outline-none focus:ring-2 focus:ring-[#DA7339]"
                                />
                            </div>

                            {/* Location Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Vị trí hiện tại"
                                    className="w-full p-3 bg-transparent border border-[#2D1E1A] rounded-md text-[#2D1E1A] placeholder-[#2D1E1A] focus:outline-none focus:ring-2 focus:ring-[#DA7339] pl-10"
                                />
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#2D1E1A]" />
                            </div>

                            {/* Confirm Button */}
                            <div>
                                <Button className="w-full bg-[#DA7339] hover:bg-orange-600 text-[#EFE6DB] px-6 py-3 rounded-md font-bold flex items-center justify-center gap-2">
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};