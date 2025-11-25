'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UtensilsCrossed, Plus, Search, Loader2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminPageLayout, AdminPageHeader, AdminStatsGrid } from '../components/AdminPageLayout';
import { AdminCard } from '../components/AdminCard';
import {
    getAllBranchProducts,
    type Product,
    type AllBranchProductSearchParams
} from '@/apis/product.api';
import { ProductForm } from './components/ProductForm';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(12);

    // Dialogs
    const [showProductForm, setShowProductForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params: AllBranchProductSearchParams = {
                keyword: searchKeyword,
                page: currentPage,
                size: pageSize,
                sortBy: 'createdDate',
                sortDirection: 'DESC'
            };
            const response = await getAllBranchProducts(params);
            setProducts(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchKeyword]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setShowProductForm(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setShowProductForm(true);
    };

    return (
        <AdminGuard>
            <AdminPageLayout>
                {/* Header */}
                <AdminPageHeader
                    title="Quản Lý Sản Phẩm"
                    description="Quản lý menu và giá sản phẩm"
                    icon={UtensilsCrossed}
                    actions={
                        <Button
                            onClick={handleAddProduct}
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                        >
                            <Plus size={18} className="mr-2" strokeWidth={2.5} />
                            Thêm Sản Phẩm
                        </Button>
                    }
                />

                {/* Stats */}
                <AdminStatsGrid>
                    <AdminCard
                        title="Tổng sản phẩm"
                        value={totalElements}
                        icon={UtensilsCrossed}
                    />
                </AdminStatsGrid>

                {/* Filters */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {products.map(product => (
                            <Card key={product.productId} className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 group rounded-2xl cursor-pointer flex flex-col h-full py-0">
                                {/* Product Image */}
                                <div className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {product.productImage ? (
                                        <img
                                            src={product.productImage}
                                            alt={product.productName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <span className="text-6xl">🍜</span>
                                    )}

                                    {/* Category Badge */}
                                    <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-700 shadow-md">
                                        {product.productType}
                                    </span>
                                </div>

                                {/* Product Info */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                                        {product.productName}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">{product.productDescription}</p>

                                    <div className="mt-auto">
                                        {/* Price */}
                                        <div className="mb-4 pt-4 border-t-2 border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1 font-medium">Giá bán</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                                    {new Intl.NumberFormat('vi-VN').format(product.productPrice)}
                                                </span>
                                                <span className="text-base font-bold text-gray-600">đ</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditProduct(product)}
                                                className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all duration-300 py-5"
                                            >
                                                <Edit size={16} className="mr-1" strokeWidth={2.5} />
                                                Sửa
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 sm:mt-10 flex justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="rounded-xl font-semibold text-xs sm:text-sm"
                    >
                        Trước
                    </Button>
                    <span className="flex items-center px-4 font-semibold text-sm">
                        Trang {currentPage + 1} / {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="rounded-xl font-semibold text-xs sm:text-sm"
                    >
                        Sau
                    </Button>
                </div>

                {/* Product Form Dialog */}
                <ProductForm
                    open={showProductForm}
                    onOpenChange={setShowProductForm}
                    product={selectedProduct}
                    onSuccess={fetchProducts}
                />
            </AdminPageLayout>
        </AdminGuard>
    );
}
