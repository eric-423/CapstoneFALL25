'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UtensilsCrossed, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';

// Temporary empty array until API is implemented
const MOCK_PRODUCTS: any[] = [];

export default function ProductsPage() {
    return (
        <AdminGuard>
            <AdminPageLayout>
                {/* Header */}
                <AdminPageHeader
                    title="Quản Lý Sản Phẩm"
                    description="Quản lý menu và giá sản phẩm"
                    icon={UtensilsCrossed}
                    actions={
                        <Button className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base">
                            <Plus size={18} className="mr-2" strokeWidth={2.5} />
                            Thêm Sản Phẩm
                        </Button>
                    }
                />

                {/* Stats */}
                <AdminStatsGrid>
                    <AdminStatsCard
                        title="Tổng sản phẩm"
                        value={MOCK_PRODUCTS.length}
                        icon={UtensilsCrossed}
                    />
                    <AdminStatsCard
                        title="Còn hàng"
                        value={MOCK_PRODUCTS.filter(p => p.status === true).length}
                        icon={CheckCircle}
                        className="border-green-200"
                        iconClassName="from-green-400 to-green-600"
                    />
                    <AdminStatsCard
                        title="Hết hàng"
                        value={MOCK_PRODUCTS.filter(p => p.status === false).length}
                        icon={XCircle}
                        className="border-red-200"
                        iconClassName="from-red-400 to-red-600"
                    />
                    <AdminStatsCard
                        title="Giá trung bình"
                        value={MOCK_PRODUCTS.length > 0 ? `${Math.round(MOCK_PRODUCTS.reduce((sum, p) => sum + p.productPrice, 0) / MOCK_PRODUCTS.length / 1000)}k` : '0k'}
                        icon={UtensilsCrossed}
                        className="border-[#F8A91F]/20"
                        iconClassName="from-[#EC6426] to-[#F8A91F]"
                    />
                </AdminStatsGrid>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {MOCK_PRODUCTS.map(product => (
                            <Card key={product.productId} className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 group rounded-2xl cursor-pointer">
                                {/* Product Image */}
                                <div className="relative h-56 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center overflow-hidden">
                                    <span className="text-8xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">🍜</span>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    {/* Status Badge */}
                                    <span className={`absolute top-4 right-4 flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold shadow-lg backdrop-blur-sm ${product.status
                                        ? 'bg-green-500/90 text-white border-2 border-white/50'
                                        : 'bg-gray-600/90 text-white border-2 border-white/50'
                                        }`}>
                                        {product.status ? <CheckCircle size={14} strokeWidth={2.5} /> : <XCircle size={14} strokeWidth={2.5} />}
                                        {product.status ? 'Còn hàng' : 'Hết hàng'}
                                    </span>

                                    {/* Category Badge */}
                                    <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-700 shadow-md">
                                        {product.productType}
                                    </span>
                                </div>

                                {/* Product Info */}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                                        {product.productName}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">{product.productDescription}</p>

                                    {/* Quantity Badge */}
                                    <div className="mb-3">
                                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold">
                                            Tồn kho: {product.productQuantity}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4 pt-4 border-t-2 border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1 font-medium">Giá bán</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                                {product.productPrice.toLocaleString()}
                                            </span>
                                            <span className="text-base font-bold text-gray-600">đ</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all duration-300 py-5"
                                        >
                                            <Edit size={16} className="mr-1" strokeWidth={2.5} />
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all duration-300 py-5"
                                        >
                                            <Trash2 size={16} className="mr-1" strokeWidth={2.5} />
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                {/* Pagination */}
                <div className="mt-6 sm:mt-10 flex justify-center">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl font-semibold text-xs sm:text-sm">Trước</Button>
                        <Button variant="outline" size="sm" className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white rounded-xl font-semibold border-0 shadow-md text-xs sm:text-sm">1</Button>
                        <Button variant="outline" size="sm" className="rounded-xl font-semibold hover:bg-gray-100 text-xs sm:text-sm">2</Button>
                        <Button variant="outline" size="sm" className="rounded-xl font-semibold hover:bg-gray-100 text-xs sm:text-sm">3</Button>
                        <Button variant="outline" size="sm" className="rounded-xl font-semibold text-xs sm:text-sm">Sau</Button>
                    </div>
                </div>
            </AdminPageLayout>
        </AdminGuard>
    );
}
