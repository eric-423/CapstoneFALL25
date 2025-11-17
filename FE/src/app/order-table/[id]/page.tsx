'use client';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import useScrollTop from '@/utils/hooks/useScrollTop';
import { ProductType, Product, getProduct, getProductType } from '@/apis/product.api';
import { Combo, searchCombos } from '@/apis/combo.api';
import { createDiningOrder, payDiningTableOrder, updateDiningTableOrder, DiningOrderRequest, DiningTablePaymentRequest, UpdateDiningTableOrderRequest } from '@/apis/order.api';
import { PaymentMethod, getPaymentMethods } from '@/apis/payment.api';
import { TableData, getTableById } from '@/apis/table.api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle, ChevronUp, ChevronDown, Menu, X, Receipt, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TableProductCard from '../components/table-product-card';
import TableComboCard from '../components/table-combo-card';
import StyledHeading from '@/components/common/styled-heading';
import image from '@/assets/images/Home - Banner.jpg';
import Image from 'next/image';

interface CartItem {
    productId: number;
    comboId: number;
    productName: string;
    price: number;
    quantity: number;
    productImage?: string;
    isCombo?: boolean;
    note?: string;
}

export default function OrderTablePage() {
    useScrollTop();
    const params = useParams();
    const tableId = params?.id as string;

    const [productType, setProductType] = useState<ProductType>({ id: 0, name: 'Tất cả' });
    const [viewMode, setViewMode] = useState<'products' | 'combos'>('products'); // New state for view mode
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
    const [isCartExpanded, setIsCartExpanded] = useState(false);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoadingProducts] = useState(false);
    const [isLoadingProductTypes] = useState(false);
    const [isLoadingCombos, setIsLoadingCombos] = useState(false);
    const [showOrderedItems, setShowOrderedItems] = useState(false);
    const [tableData, setTableData] = useState<TableData | null>(null);
    const [productList, setProductList] = useState<Product[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [comboList, setComboList] = useState<Combo[]>([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(1);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);

    // Fetch table data on mount
    useEffect(() => {
        const fetchTableData = async () => {
            if (!tableId) return;

            try {
                const data = await getTableById(tableId);
                setTableData(data);
            } catch (error) {
                console.error('Error fetching table data:', error);
            }
        };

        fetchTableData();
    }, [tableId]);

    // Fetch product types
    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const types = await getProductType();
                setProductTypes(types);
            } catch (error) {
                console.error('Error fetching product types:', error);
            }
        };

        fetchProductTypes();
    }, []);

    // Fetch payment methods on mount
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                setIsLoadingPaymentMethods(true);
                const methods = await getPaymentMethods();
                setPaymentMethods(methods);
                // Set default payment method to first one
                if (methods.length > 0) {
                    setSelectedPaymentMethod(methods[0].id);
                }
            } catch (error) {
                console.error('Error fetching payment methods:', error);
            } finally {
                setIsLoadingPaymentMethods(false);
            }
        };

        fetchPaymentMethods();
    }, []);

    // Fetch products when branchId or productType changes
    useEffect(() => {
        const fetchProducts = async () => {
            if (!tableData?.branchId) return;

            try {
                const response = await getProduct(
                    tableData.branchId,
                    '', // keyword
                    true, // isActive
                    0, // minPrice
                    999999999, // maxPrice
                    0, // page
                    100, // size
                    'name', // sortBy
                    'ASC', // sortDirection
                    productType.id === 0 ? undefined : productType.id // productTypeId
                );
                setProductList(response.data.content);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [tableData?.branchId, productType]);

    // Fetch combos when branchId changes
    useEffect(() => {
        const fetchCombos = async () => {
            if (!tableData?.branchId) return;

            try {
                setIsLoadingCombos(true);
                const response = await searchCombos({
                    branchId: tableData.branchId,
                    page: 0,
                    size: 100,
                });
                setComboList(response.content);
            } catch (error) {
                console.error('Error fetching combos:', error);
            } finally {
                setIsLoadingCombos(false);
            }
        };

        fetchCombos();
    }, [tableData?.branchId]);

    const addToCart = (product: Product) => {
        const existingItem = cartItems.find((item) => item.productId === product.productId && !item.isCombo);
        if (existingItem) {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.productId === product.productId && !item.isCombo ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCartItems((prev) => [
                ...prev,
                {
                    productId: product.productId,
                    comboId: 0,
                    productName: product.productName,
                    price: product.productPrice,
                    quantity: 1,
                    productImage: product.productImage,
                    isCombo: false,
                },
            ]);
        }
    };

    const addComboToCart = (combo: Combo) => {
        const existingItem = cartItems.find((item) => item.comboId === combo.comboId && item.isCombo);
        if (existingItem) {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.comboId === combo.comboId && item.isCombo ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCartItems((prev) => [
                ...prev,
                {
                    productId: 0,
                    comboId: combo.comboId,
                    productName: combo.name,
                    price: combo.price,
                    quantity: 1,
                    isCombo: true,
                },
            ]);
        }
    };

    const removeFromCart = (productId: number, comboId: number, isCombo: boolean) => {
        setCartItems((prev) => prev.filter((item) => {
            if (isCombo) {
                return !(item.comboId === comboId && item.isCombo);
            } else {
                return !(item.productId === productId && !item.isCombo);
            }
        }));
    };

    const updateQuantity = (productId: number, comboId: number, quantity: number, isCombo: boolean) => {
        if (quantity <= 0) {
            removeFromCart(productId, comboId, isCombo);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => {
                if (isCombo) {
                    return item.comboId === comboId && item.isCombo ? { ...item, quantity } : item;
                } else {
                    return item.productId === productId && !item.isCombo ? { ...item, quantity } : item;
                }
            })
        );
    };

    const updateNote = (productId: number, comboId: number, note: string, isCombo: boolean) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (isCombo) {
                    return item.comboId === comboId && item.isCombo ? { ...item, note } : item;
                } else {
                    return item.productId === productId && !item.isCombo ? { ...item, note } : item;
                }
            })
        );
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleConfirmOrder = async () => {
        if (cartItems.length === 0) {
            alert('Vui lòng chọn món ăn!');
            return;
        }

        if (!tableData?.branchId || !tableId) {
            alert('Không tìm thấy thông tin bàn!');
            return;
        }

        try {
            setIsOrderConfirmed(true);

            // Check if there's an existing order (currentOrder exists and has id)
            const hasExistingOrder = tableData.currentOrder && tableData.currentOrder.id;

            if (hasExistingOrder) {
                // Update existing order by adding new items
                const updateRequest: UpdateDiningTableOrderRequest = {
                    diningTableId: parseInt(tableId),
                    orderItems: cartItems.map(item => ({
                        productId: item.isCombo ? 0 : item.productId,
                        comboId: item.isCombo ? item.comboId : 0,
                        quantity: item.quantity,
                        price: item.price,
                        note: item.note || '',
                    })),
                };

                await updateDiningTableOrder(tableData.currentOrder!.id, updateRequest);
            } else {
                // Create new order if no existing order
                const orderRequest: DiningOrderRequest = {
                    customerId: tableData.currentOrder?.customerDTO?.id || 0,
                    promotionCode: '',
                    discountValue: 0,
                    shippingAddress: '',
                    shippingPhoneNumber: '',
                    orderItemList: cartItems.map(item => ({
                        productId: item.isCombo ? 0 : item.productId,
                        comboId: item.isCombo ? item.comboId : 0,
                        quantity: item.quantity,
                        price: item.price,
                        note: item.note || '',
                    })),
                    mode: 'DINING',
                    diningTableId: parseInt(tableId),
                    branchId: tableData.branchId,
                };

                await createDiningOrder(orderRequest);
            }

            // Reload table data to get updated order
            const updatedTableData = await getTableById(tableId);
            setTableData(updatedTableData);

            setIsOrderConfirmed(false);
            setShowSuccessScreen(true);
            setCartItems([]);
        } catch (error) {
            console.error('Error creating/updating dining order:', error);
            alert('Có lỗi xảy ra khi đặt món. Vui lòng thử lại!');
            setIsOrderConfirmed(false);
        }
    };

    const handleBackToMenu = () => {
        setShowSuccessScreen(false);
    };

    const handleProductTypeChange = (type: ProductType) => {
        setProductType(type);
        setViewMode('products'); // Switch to products view when selecting a product type
        setIsSidebarOpen(false);
    };

    const handlePayment = () => {
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async () => {
        if (!tableData?.currentOrder?.id) {
            alert('Không tìm thấy đơn hàng!');
            return;
        }

        try {
            setIsProcessingPayment(true);

            const paymentRequest: DiningTablePaymentRequest = {
                orderId: tableData.currentOrder.id,
                paymentMethodId: selectedPaymentMethod,
                promotionCode: '',
                discountValue: 0,
            };

            const response = await payDiningTableOrder(paymentRequest);

            // Check if this is PayOS payment (has paymentUrl)
            if (response.data?.paymentUrl) {
                // Open PayOS payment link in new window
                window.open(response.data.paymentUrl, '_blank');
                alert('Vui lòng hoàn tất thanh toán trên cửa sổ PayOS đã mở!');
                setShowPaymentModal(false);
            } else {
                // Cash payment - completed immediately
                alert('Thanh toán thành công!');
                setShowPaymentModal(false);
                setShowOrderedItems(false);
            }

            // Reload table data to get updated payment status
            const updatedTableData = await getTableById(tableId);
            setTableData(updatedTableData);
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!');
        } finally {
            setIsProcessingPayment(false);
        }
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
                            {/* Combo Button */}
                            <Button
                                variant={viewMode === 'combos' ? 'default' : 'ghost'}
                                className={`w-full justify-start transition-all duration-200 hover:scale-105 ${viewMode === 'combos' ? 'bg-orange-500 hover:bg-orange-600' : ''
                                    }`}
                                onClick={() => {
                                    setViewMode('combos');
                                    setProductType({ id: 0, name: 'Tất cả' });
                                }}
                            >
                                <span className="mr-2">🎁</span>
                                Combo Ưu Đãi
                            </Button>

                            {/* Divider */}
                            <div className="border-t my-3"></div>

                            {isLoadingProductTypes ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner className="h-6 w-6" />
                                </div>
                            ) : (
                                productTypes?.map((type, index) => (
                                    <Button
                                        key={type.id}
                                        variant={productType.id === type.id && viewMode === 'products' ? 'default' : 'ghost'}
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
                        {/* Combo Button */}
                        <Button
                            variant={viewMode === 'combos' ? 'default' : 'ghost'}
                            className={`w-full justify-start ${viewMode === 'combos' ? 'bg-orange-500 hover:bg-orange-600' : ''
                                }`}
                            onClick={() => {
                                setViewMode('combos');
                                setProductType({ id: 0, name: 'Tất cả' });
                            }}
                        >
                            <span className="mr-2">🎁</span>
                            Combo Ưu Đãi
                        </Button>

                        {/* Divider */}
                        <div className="border-t my-3"></div>

                        {isLoadingProductTypes ? (
                            <div className="flex items-center justify-center py-8">
                                <LoadingSpinner className="h-6 w-6" />
                            </div>
                        ) : (
                            productTypes?.map((type) => (
                                <Button
                                    key={type.id}
                                    variant={productType.id === type.id && viewMode === 'products' ? 'default' : 'ghost'}
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
                    <h1 className="text-lg font-bold">{tableData?.name || 'Đặt món tại bàn'}</h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowOrderedItems(true)}
                        className="p-2 relative"
                        disabled={!tableData?.currentOrder?.orderItems?.length}
                    >
                        <Receipt className="h-6 w-6" />
                        {tableData?.currentOrder?.orderItems?.length ? (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {tableData.currentOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                            </Badge>
                        ) : null}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pt-16 lg:pt-6 pb-20 lg:ml-64 max-w-7xl">
                {/* Desktop Sticky Ordered Items Button - Floating */}
                <div className="hidden lg:block fixed top-6 right-6 z-40">
                    <Button
                        variant="default"
                        onClick={() => setShowOrderedItems(true)}
                        className="gap-2 shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
                        disabled={!tableData?.currentOrder?.orderItems?.length}
                    >
                        <Receipt className="h-5 w-5" />
                        Xem món đã đặt
                        {tableData?.currentOrder?.orderItems?.length ? (
                            <Badge variant="secondary" className="bg-white text-primary">
                                {tableData.currentOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                            </Badge>
                        ) : null}
                    </Button>
                </div>

                <div id="hero-section" className="relative h-48 sm:h-56 md:h-64 overflow-hidden mb-6">
                    <Image
                        src={image}
                        alt="Đặt món tại bàn"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex items-center justify-center">
                        <div className="text-center px-4">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                <StyledHeading text="Đặt món tại bàn" />
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="w-full" id="menu-content">
                    {/* Products Section - Show only when viewMode is 'products' */}
                    {viewMode === 'products' && (
                        <div className="mt-4">
                            <h2 className="text-xl font-bold mb-4">Món ăn</h2>
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
                    )}

                    {/* Combos Section - Show only when viewMode is 'combos' */}
                    {viewMode === 'combos' && (
                        <div className="mt-4">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-orange-600">Combo Ưu Đãi</span>
                                <Badge className="bg-orange-500 hover:bg-orange-600">Hot</Badge>
                            </h2>
                            {isLoadingCombos ? (
                                <div className="flex items-center justify-center">
                                    <LoadingSpinner className="my-10 h-8 w-8 animate-spin" />
                                </div>
                            ) : comboList.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                    {comboList.map((combo) => (
                                        <TableComboCard key={combo.comboId} combo={combo} onAddToCart={addComboToCart} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Hiện tại chưa có combo nào</p>
                                </div>
                            )}
                        </div>
                    )}
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
                                <div className="max-h-64 overflow-y-auto p-3 space-y-3">
                                    {cartItems.map((item) => (
                                        <div
                                            key={`${item.isCombo ? 'combo' : 'product'}-${item.isCombo ? item.comboId : item.productId}`}
                                            className="bg-white rounded-lg p-3 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate text-sm">{item.productName}</p>
                                                    <p className="text-gray-500 text-xs">{item.price.toLocaleString()}đ</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuantity(item.productId, item.comboId, item.quantity - 1, item.isCombo || false)}
                                                        className="h-6 w-6 p-0 text-xs"
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-8 text-center text-xs">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuantity(item.productId, item.comboId, item.quantity + 1, item.isCombo || false)}
                                                        className="h-6 w-6 p-0 text-xs"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Ghi chú (VD: Không cay, nhiều rau...)"
                                                value={item.note || ''}
                                                onChange={(e) => updateNote(item.productId, item.comboId, e.target.value, item.isCombo || false)}
                                                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
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

            {/* Ordered Items Modal */}
            {showOrderedItems && tableData?.currentOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Món đã đặt</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {tableData.name} - {tableData.currentOrder.customerName}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowOrderedItems(false)}
                                className="p-2 hover:bg-gray-100"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {tableData.currentOrder.orderItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <Receipt className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Chưa có món nào được đặt</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tableData.currentOrder.orderItems.map((item, index) => {
                                        // Check if this is a combo or regular product
                                        const isCombo = item.comboDTO !== null;
                                        const displayName = isCombo ? item.comboDTO?.name : item.productName;
                                        const displayImage = isCombo ? null : item.productImg;
                                        const displayDescription = isCombo ? item.comboDTO?.description : null;
                                        const displayPrice = isCombo ? (item.comboDTO?.price || 0) : item.price;

                                        return (
                                            <div
                                                key={`${isCombo ? 'combo' : 'product'}-${isCombo ? item.comboDTO?.id : item.productId}-${index}`}
                                                className={`flex items-start gap-4 p-4 rounded-xl hover:bg-gray-100 transition-colors ${isCombo ? 'bg-orange-50 border-2 border-orange-200' : 'bg-gray-50'
                                                    }`}
                                            >
                                                {/* Product/Combo Image */}
                                                <div className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${isCombo ? 'bg-gradient-to-br from-orange-100 to-orange-50' : 'bg-white'
                                                    }`}>
                                                    {displayImage ? (
                                                        <Image
                                                            src={displayImage}
                                                            alt={displayName || ''}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : isCombo ? (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingCart className="h-10 w-10 text-orange-400" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                            <Receipt className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                    {isCombo && (
                                                        <div className="absolute top-1 right-1">
                                                            <Badge className="bg-orange-500 text-white text-[10px] px-1 py-0">
                                                                COMBO
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Item Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-semibold mb-1 ${isCombo ? 'text-orange-700' : 'text-gray-900'}`}>
                                                        {displayName}
                                                    </h3>
                                                    {displayDescription && (
                                                        <p className="text-xs text-gray-600 mb-1">
                                                            {displayDescription}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {displayPrice.toLocaleString()}đ × {item.quantity}
                                                    </p>
                                                    {item.note && (
                                                        <p className="text-xs text-gray-500 italic">
                                                            Ghi chú: {item.note}
                                                        </p>
                                                    )}
                                                    <div className="flex gap-2 mt-2">
                                                        {item.isConfirmed && (
                                                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                                Đã xác nhận
                                                            </Badge>
                                                        )}
                                                        {item.isDelivered && (
                                                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                                Đã giao
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className={`font-semibold text-lg ${isCombo ? 'text-orange-600' : 'text-primary'}`}>
                                                        {(displayPrice * item.quantity).toLocaleString()}đ
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer with Total and Payment */}
                        <div className="border-t bg-gray-50 p-6 space-y-4">
                            {/* Order Info */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="font-medium">
                                        {tableData.currentOrder.orderItems.reduce((total, item) => {
                                            const isCombo = item.comboDTO !== null;
                                            const itemPrice = isCombo ? (item.comboDTO?.price || 0) : item.price;
                                            return total + (itemPrice * item.quantity);
                                        }, 0).toLocaleString()}đ
                                    </span>
                                </div>
                                {tableData.currentOrder.discountValue && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá:</span>
                                        <span>-{tableData.currentOrder.discountValue.toLocaleString()}đ</span>
                                    </div>
                                )}
                                {tableData.currentOrder.discountPercent && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá:</span>
                                        <span>-{tableData.currentOrder.discountPercent}%</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Tổng cộng:</span>
                                    <span className="text-primary">
                                        {(() => {
                                            const subTotal = tableData.currentOrder.orderItems.reduce((total, item) => {
                                                const isCombo = item.comboDTO !== null;
                                                const itemPrice = isCombo ? (item.comboDTO?.price || 0) : item.price;
                                                return total + (itemPrice * item.quantity);
                                            }, 0);
                                            const discount = tableData.currentOrder.discountValue || 0;
                                            return (subTotal - discount).toLocaleString();
                                        })()}đ
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowOrderedItems(false)}
                                    className="flex-1"
                                >
                                    Tiếp tục đặt món
                                </Button>
                            </div>

                            {/* Status */}
                            <div className="text-center">
                                <Badge
                                    variant={tableData.currentOrder.orderStatus === 'PAID' ? 'default' : 'secondary'}
                                    className="text-xs"
                                >
                                    {tableData.currentOrder.orderStatus === 'IN_PROCESS' && 'Đang xử lý'}
                                    {tableData.currentOrder.orderStatus === 'PAID' && 'Đã thanh toán'}
                                    {tableData.currentOrder.orderStatus === 'COMPLETED' && 'Hoàn thành'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
