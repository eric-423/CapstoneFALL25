import { ProductCard } from '@/components/common/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/apis/product.api';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { AnimatedCard } from '@/components/common/animated-card';
import { memo, useMemo } from 'react';

type BestSellersNewProps = {
    products: Product[];
};

const BestSellersSection = memo(({ products = [] }: BestSellersNewProps) => {
    // Mock data for fallback - matching the design
    const mockBestSellers = [
        {
            id: 1,
            title: "CƠM SƯỜN NƯỚNG MĂM",
            description: "Sườn nướng cơm mắm, đồng cơm sườn và nem",
            price: "35,000",
            originalPrice: "45,000",
            rating: 5,
            image: "/images/content-4.jpg",
            badge: "Đặt ngay"
        },
        {
            id: 2,
            title: "COMBO - SỰ BỔ CHỦ ÔNG",
            description: "- Cơm tấm sườn nướng, bi, chả trứng\n- Canh bí đao\n- Nước mật ớt chặm",
            price: "40,000",
            image: "/images/content-5.jpg",
            badge: "Thêm"
        },
        {
            id: 3,
            title: "COMBO - SỰ BỔ CHỦ ÔNG",
            description: "- Cước sườn nướng, bi, chả trứng\n- Canh bí đao\n- Nước mật ớt chặm",
            price: "45,000",
            image: "/images/content-6.jpg",
            badge: "Thêm"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-yellow-200 to-yellow-100">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                        BEST SELLERS
                    </h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                    {products && products.length > 0 ? (
                        products.map((product, index) => (
                            <AnimatedCard key={product.productId} index={index}>
                                <ProductCard item={product} descriptionOverflow={80} />
                            </AnimatedCard>
                        ))
                    ) : (
                        // Fallback mock cards when no products
                        mockBestSellers.map((item, index) => (
                            <AnimatedCard
                                key={item.id}
                                index={index}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                        loading="lazy"
                                    />
                                    {item.originalPrice && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                                            Giảm giá
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center shadow-md">
                                        <Star className="w-4 h-4 text-yellow-500 mr-1" fill="#F59E0B" />
                                        <span className="text-sm font-medium">{item.rating || 5}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 min-h-[60px] whitespace-pre-line">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-orange-500">
                                                {item.price}đ
                                            </span>
                                            {item.originalPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {item.originalPrice}đ
                                                </span>
                                            )}
                                        </div>

                                        <Button
                                            size="sm"
                                            className="bg-orange-500 hover:bg-orange-600 text-white"
                                        >
                                            {item.badge}
                                        </Button>
                                    </div>
                                </div>
                            </AnimatedCard>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
});

BestSellersSection.displayName = 'BestSellersSection';

export default BestSellersSection;