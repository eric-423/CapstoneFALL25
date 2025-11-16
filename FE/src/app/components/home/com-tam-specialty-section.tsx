'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import Image from 'next/image';

const ComTamSpecialtySection = () => {
    const specialties = [
        {
            id: 1,
            title: "🍙 HỘP SỰ AN LÀNH CỐC 2025: TỰ ĐỊNH TỪ YÊU NẮM...",
            description: "Đặc biệt",
            image: "/images/tam-tac-content.jpg",
            qrCode: true
        },
        {
            id: 2,
            title: "🍙 HỘP SỰ AN LÀNH CỐC 2025: TỰ ĐỊNH TỪ YÊU NẮM...",
            description: "Đặc biệt",
            image: "/images/tam-tac-content (2).jpg",
            qrCode: true
        },
        {
            id: 3,
            title: "🍙 HỘP SỰ AN LÀNH CỐC 2025: TỰ ĐỊNH TỪ YÊU NẮM...",
            description: "Đặc biệt",
            image: "/images/tam-tac-content (3).jpg",
            qrCode: true
        },
        {
            id: 4,
            title: "🍙 HỘP SỰ AN LÀNH CỐC 2025: TỰ ĐỊNH TỪ YÊU NẮM...",
            description: "Đặc biệt",
            image: "/images/tam-tac-content.jpg",
            qrCode: true
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-yellow-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                        CHUYÊN CƠM TẤM
                    </h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {specialties.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Image with QR Code overlay */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* QR Code Badge */}
                                {item.qrCode && (
                                    <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md">
                                        <QrCode className="w-6 h-6 text-gray-600" />
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Title Overlay */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white font-bold text-sm leading-tight mb-2">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 font-medium">
                                        {item.description}
                                    </span>

                                    <Button
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1"
                                    >
                                        Đặc biệt
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ComTamSpecialtySection;