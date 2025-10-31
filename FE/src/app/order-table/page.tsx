'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import useScrollTop from '@/utils/hooks/useScrollTop';
import { ProductType, Product } from '@/apis/product.api';
import { mockProducts, mockProductTypes, getProductsByType } from './mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle, ChevronUp, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import TableProductCard from './components/table-product-card';
import StyledHeading from '@/components/common/styled-heading';
import image from '@/assets/images/Home - Banner.jpg';
import Image from 'next/image';

interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    productImage?: string;
}

export default function OrderTablePage() {
    useScrollTop();
    const [productType, setProductType] = useState<ProductType>({ id: 0, name: 'Tất cả' });
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
    const [isCartExpanded, setIsCartExpanded] = useState(false);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoadingProducts] = useState(false);
    const [isLoadingProductTypes] = useState(false);

    const productList = getProductsByType(productType.id);
    const productTypes = mockProductTypes;

    const addToCart = (product: Product) => {
        const existingItem = cartItems.find((item) => item.productId === product.productId);
        if (existingItem) {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCartItems((prev) => [
                ...prev,
                {
                    productId: product.productId,
                    productName: product.productName,
                    price: product.productPrice,
                    quantity: 1,
                    productImage: product.productImage,
                },
            ]);
        }
    };

    const removeFromCart = (productId: number) => {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        );
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleConfirmOrder = () => {
        if (cartItems.length === 0) {
            alert('Vui lòng chọn món ăn!');
            return;
        }

        setIsOrderConfirmed(true);
        setTimeout(() => {
            setIsOrderConfirmed(false);
            setShowSuccessScreen(true);
            setCartItems([]);
        }, 2000);
    };

    const handleBackToMenu = () => {
        setShowSuccessScreen(false);
    };

    const handleProductTypeChange = (type: ProductType) => {
        setProductType(type);
        setIsSidebarOpen(false);
    };

    if (showSuccessScreen) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="max-w-md mx-auto p-8 text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">Đặt món thành công!</h1>
                            <p className="text-gray-600">
                                Đơn hàng của bạn đã được gửi đến bếp. Vui lòng chờ nhân viên phục vụ mang món đến.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p className="text-sm text-gray-600">Thời gian chuẩn bị dự kiến:</p>
                            <p className="text-lg font-semibold text-primary">15-20 phút</p>
                        </div>
                        <Button onClick={handleBackToMenu} className="w-full bg-primary hover:bg-primary/90">
                            Tiếp tục đặt món
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-hidden">
            <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-300 ${isSidebarOpen ? 'bg-opacity-50' : 'bg-opacity-0'
                        }`}
                    onClick={() => setIsSidebarOpen(false)}
                />
                <div
                    className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Danh mục món ăn</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 hover:bg-gray-100 transition-colors duration-200"
                            >
                                <X className="h-5 w-5 transition-transform duration-200 hover:rotate-90" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {isLoadingProductTypes ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner className="h-6 w-6" />
                                </div>
                            ) : (
                                productTypes?.map((type, index) => (
                                    <Button
                                        key={type.id}
                                        variant={productType.id === type.id ? 'default' : 'ghost'}
                                        className="w-full justify-start transition-all duration-200 hover:scale-105"
                                        onClick={() => handleProductTypeChange(type)}
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                            animation: isSidebarOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none',
                                        }}
                                    >
                                        {type.name}
                                    </Button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gray-50 border-r pt-20 z-30">
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-6">Danh mục món ăn</h2>
                    <div className="space-y-2">
                        {isLoadingProductTypes ? (
                            <div className="flex items-center justify-center py-8">
                                <LoadingSpinner className="h-6 w-6" />
                            </div>
                        ) : (
                            productTypes?.map((type) => (
                                <Button
                                    key={type.id}
                                    variant={productType.id === type.id ? 'default' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => handleProductTypeChange(type)}
                                >
                                    {type.name}
                                </Button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsSidebarOpen(true)}
                        className={`p-2 transition-transform duration-300 ${isSidebarOpen ? 'rotate-90' : 'rotate-0'}`}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <h1 className="text-lg font-bold">Đặt món tại bàn</h1>
                    <div className="w-10" />
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pt-16 lg:pt-6 pb-20 lg:ml-64 max-w-7xl">
                <div id="hero-section" className="relative h-48 sm:h-56 md:h-64 overflow-hidden mb-6">
                    <Image src={image} alt="Đặt món tại bàn" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex items-center justify-center">
                        <div className="text-center px-4">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                <StyledHeading text="Đặt món tại bàn" />
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="w-full" id="menu-content">
                    <div className="mt-4">
                        {isLoadingProducts ? (
                            <div className="flex items-center justify-center">
                                <LoadingSpinner className="my-10 h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                {productList.map((product) => (
                                    <TableProductCard key={product.productId} product={product} onAddToCart={addToCart} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cart */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
                    <div className="max-w-md mx-auto">
                        <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => setIsCartExpanded(!isCartExpanded)}
                        >
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                <span className="font-semibold text-sm">Thêm Món</span>
                                <Badge variant="secondary" className="text-xs">
                                    {getTotalItems()}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-primary">{getTotalPrice().toLocaleString()}đ</span>
                                {isCartExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                            </div>
                        </div>

                        {isCartExpanded && (
                            <div className="border-t bg-gray-50">
                                <div className="max-h-48 overflow-y-auto p-3 space-y-2">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="flex items-center justify-between text-xs bg-white rounded p-2"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.productName}</p>
                                                <p className="text-gray-500">{item.price.toLocaleString()}đ</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="h-5 w-5 p-0 text-xs"
                                                >
                                                    -
                                                </Button>
                                                <span className="w-6 text-center text-xs">{item.quantity}</span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="h-5 w-5 p-0 text-xs"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 bg-white border-t">
                                    <Button
                                        onClick={handleConfirmOrder}
                                        disabled={isOrderConfirmed}
                                        className="w-full text-sm h-10"
                                    >
                                        {isOrderConfirmed ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Xác nhận thêm món
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}