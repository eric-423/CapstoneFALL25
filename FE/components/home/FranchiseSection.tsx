'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { ExternalLink, Award, Users, TrendingUp } from 'lucide-react';

const franchiseCards = [
    {
        id: 1,
        title: 'HỢI XUÂN LẶNG GỐC',
        subtitle: '2025: TỦ ĐỊNH TĂNG NĂM...',
        description: 'Mô tả các điều khoản tham gia nhượng quyền và lợi ích đối tác',
        image: '/images/story.svg',
        link: '#',
        color: 'bg-gradient-to-br from-orange-400 to-red-500'
    },
    {
        id: 2,
        title: 'HỢI XUÂN LẶNG GỐC',
        subtitle: '2025: TỦ ĐỊNH TĂNG NĂM...',
        description: 'Cơ hội đầu tư sinh lời cao với mô hình kinh doanh đã được kiểm chứng',
        image: '/images/story.svg',
        link: '#',
        color: 'bg-gradient-to-br from-yellow-400 to-orange-500'
    },
    {
        id: 3,
        title: 'HỢI XUÂN LẶNG GỐC',
        subtitle: '2025: TỦ ĐỊNH TĂNG NĂM...',
        description: 'Hệ thống đào tạo chuyên nghiệp và hỗ trợ vận hành toàn diện',
        image: '/images/story.svg',
        link: '#',
        color: 'bg-gradient-to-br from-red-400 to-pink-500'
    },
    {
        id: 4,
        title: 'HỢI XUÂN LẶNG GỐC',
        subtitle: '2025: TỦ ĐỊNH TĂNG NĂM...',
        description: 'Thương hiệu uy tín với hệ thống cửa hàng rộng khắp cả nước',
        image: '/images/story.svg',
        link: '#',
        color: 'bg-gradient-to-br from-orange-400 to-yellow-500'
    }
];

const stats = [
    {
        icon: Users,
        number: '100+',
        label: 'Cửa hàng'
    },
    {
        icon: Award,
        number: '5+',
        label: 'Năm kinh nghiệm'
    },
    {
        icon: TrendingUp,
        number: '95%',
        label: 'Tỷ lệ thành công'
    }
];

export const FranchiseSection: React.FC = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        CHUYỆN CƠM TẤM
                    </h2>
                </div>

                {/* Franchise Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {franchiseCards.map((card) => (
                        <div key={card.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                {/* Card Background */}
                                <div className={`${card.color} p-6 h-80 flex flex-col justify-between text-white relative`}>
                                    {/* Background Pattern/Image */}
                                    <div className="absolute inset-0 opacity-20">
                                        <Image
                                            src={card.image}
                                            alt={card.title}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">TẤM</span>
                                            </div>
                                            <ExternalLink className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 leading-tight">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm opacity-90 mb-4">
                                            {card.subtitle}
                                        </p>
                                    </div>

                                    <div className="relative z-10">
                                        <Button
                                            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 py-2 rounded-md text-sm font-medium transition-all"
                                        >
                                            Đọc tiếp
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};