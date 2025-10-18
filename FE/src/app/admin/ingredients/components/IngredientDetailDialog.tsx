'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Package,
    Factory,
    Warehouse,
    Calendar,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Thermometer,
    BarChart3,
    PackageCheck,
} from 'lucide-react';
import {
    Ingredient,
    IngredientInventory,
    IngredientBatch,
    Supplier,
} from '@/utils/types/ingredient.types';

interface IngredientDetailDialogProps {
    ingredient: Ingredient | null;
    open: boolean;
    onClose: () => void;
}

// Mock data for demo
const mockInventory: IngredientInventory[] = [
    {
        id: 'inv-1',
        ingredientId: '1',
        branchId: '1',
        branchName: 'Chi nhánh Quận 1',
        currentStock: 45,
        unit: 'kg' as any,
        minStock: 20,
        maxStock: 100,
        reorderPoint: 30,
        reorderQuantity: 50,
        totalValue: 17100000,
        status: 'adequate',
        storageLocation: 'Kho lạnh A1',
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'inv-2',
        ingredientId: '1',
        branchId: '2',
        branchName: 'Chi nhánh Quận 3',
        currentStock: 15,
        unit: 'kg' as any,
        minStock: 20,
        maxStock: 80,
        reorderPoint: 25,
        reorderQuantity: 40,
        totalValue: 5700000,
        status: 'low',
        storageLocation: 'Kho lạnh B2',
        updatedAt: new Date().toISOString(),
    },
];

const mockBatches: IngredientBatch[] = [
    {
        id: 'batch-1',
        ingredientId: '1',
        branchId: '1',
        batchNumber: 'BEEF-2025-001',
        lotNumber: 'AU-2025-Q1-001',
        quantity: 50,
        unit: 'kg' as any,
        remainingQuantity: 45,
        receivedDate: '2025-01-05T00:00:00Z',
        manufactureDate: '2025-01-01T00:00:00Z',
        expiryDate: '2026-01-01T00:00:00Z',
        supplierId: '1',
        supplierName: 'Công ty TNHH Thực Phẩm Tươi Sống',
        costPerUnit: 380000,
        totalCost: 19000000,
        status: 'active',
        qualityCheckPassed: true,
        storageLocation: 'Kho lạnh A1',
        receivedBy: 'admin@tamtac.com',
        createdAt: '2025-01-05T00:00:00Z',
        updatedAt: new Date().toISOString(),
    },
];

const mockSuppliers: Supplier[] = [
    {
        id: '1',
        name: 'Công ty TNHH Thực Phẩm Tươi Sống',
        contactPerson: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'contact@freshfood.vn',
        address: 'Quận 1, TP.HCM',
        leadTimeDays: 1,
        minOrderAmount: 500000,
        paymentTerms: 'Net 7',
        rating: 4.5,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
    },
];

export function IngredientDetailDialog({
    ingredient,
    open,
    onClose,
}: IngredientDetailDialogProps) {
    if (!ingredient) return null;

    const getStorageIcon = () => {
        switch (ingredient.storageCondition) {
            case 'frozen':
                return '❄️';
            case 'refrigerated':
                return '🧊';
            case 'cool':
                return '🌡️';
            default:
                return '📦';
        }
    };

    const getStorageLabel = () => {
        switch (ingredient.storageCondition) {
            case 'frozen':
                return 'Đông lạnh (< -18°C)';
            case 'refrigerated':
                return 'Làm lạnh (0-4°C)';
            case 'cool':
                return 'Mát (8-15°C)';
            case 'room_temp':
                return 'Nhiệt độ phòng';
            case 'dry':
                return 'Khô ráo';
            default:
                return 'Không xác định';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                        <Package className="text-orange-600" size={28} />
                        {ingredient.name}
                        {ingredient.nameEn && (
                            <span className="text-base text-gray-500 font-normal">({ingredient.nameEn})</span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="info">
                            <Package className="w-4 h-4 mr-2" />
                            Thông tin
                        </TabsTrigger>
                        <TabsTrigger value="suppliers">
                            <Factory className="w-4 h-4 mr-2" />
                            Nhà cung cấp
                        </TabsTrigger>
                        <TabsTrigger value="inventory">
                            <Warehouse className="w-4 h-4 mr-2" />
                            Tồn kho
                        </TabsTrigger>
                        <TabsTrigger value="batches">
                            <PackageCheck className="w-4 h-4 mr-2" />
                            Lô hàng
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Info */}
                    <TabsContent value="info" className="space-y-4">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Package className="text-orange-600" size={20} />
                                Thông tin cơ bản
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Tên nguyên liệu</label>
                                    <p className="text-base font-semibold text-gray-900">{ingredient.name}</p>
                                </div>
                                {ingredient.sku && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Mã SKU</label>
                                        <p className="text-base font-semibold text-gray-900">{ingredient.sku}</p>
                                    </div>
                                )}
                                {ingredient.barcode && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Barcode</label>
                                        <p className="text-base font-mono text-gray-900">{ingredient.barcode}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Danh mục</label>
                                    <Badge className="mt-1 bg-blue-100 text-blue-800">
                                        {ingredient.category}
                                    </Badge>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Đơn vị cơ bản</label>
                                    <p className="text-base font-semibold text-gray-900">{ingredient.baseUnit}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                                    <Badge
                                        className={
                                            ingredient.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }
                                    >
                                        {ingredient.status}
                                    </Badge>
                                </div>
                            </div>

                            {ingredient.description && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-600">Mô tả</label>
                                    <p className="text-base text-gray-700 mt-1">{ingredient.description}</p>
                                </div>
                            )}
                        </Card>

                        {/* Storage & Handling */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Thermometer className="text-blue-600" size={20} />
                                Bảo quản & Xử lý
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Điều kiện bảo quản</label>
                                    <p className="text-base font-semibold text-gray-900">
                                        {getStorageIcon()} {getStorageLabel()}
                                    </p>
                                </div>
                                {ingredient.shelfLifeDays && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Hạn sử dụng</label>
                                        <p className="text-base font-semibold text-gray-900">
                                            {ingredient.shelfLifeDays} ngày
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Nutritional Info */}
                        {(ingredient.caloriesPer100 ||
                            ingredient.proteinPer100 ||
                            ingredient.carbsPer100 ||
                            ingredient.fatPer100) && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <BarChart3 className="text-green-600" size={20} />
                                        Thông tin dinh dưỡng (per 100g/100ml)
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {ingredient.caloriesPer100 && (
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-orange-600">
                                                    {ingredient.caloriesPer100}
                                                </p>
                                                <p className="text-sm text-gray-600">kcal</p>
                                            </div>
                                        )}
                                        {ingredient.proteinPer100 && (
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {ingredient.proteinPer100}g
                                                </p>
                                                <p className="text-sm text-gray-600">Protein</p>
                                            </div>
                                        )}
                                        {ingredient.carbsPer100 && (
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-yellow-600">
                                                    {ingredient.carbsPer100}g
                                                </p>
                                                <p className="text-sm text-gray-600">Carbs</p>
                                            </div>
                                        )}
                                        {ingredient.fatPer100 && (
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-red-600">{ingredient.fatPer100}g</p>
                                                <p className="text-sm text-gray-600">Fat</p>
                                            </div>
                                        )}
                                    </div>
                                    {ingredient.allergens && ingredient.allergens.length > 0 && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="text-yellow-600" size={18} />
                                                <span className="font-semibold text-yellow-900">Allergens:</span>
                                                {ingredient.allergens.map((allergen) => (
                                                    <Badge key={allergen} className="bg-yellow-200 text-yellow-900">
                                                        {allergen}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            )}

                        {/* Costing */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <DollarSign className="text-green-600" size={20} />
                                Giá cả
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Giá/{ingredient.baseUnit}
                                    </label>
                                    <p className="text-2xl font-bold text-green-600">
                                        {ingredient.costPerUnit.toLocaleString()} {ingredient.currency}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Tab 2: Suppliers */}
                    <TabsContent value="suppliers" className="space-y-4">
                        {mockSuppliers.map((supplier) => (
                            <Card key={supplier.id} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                                        {supplier.contactPerson && (
                                            <p className="text-sm text-gray-600">Người liên hệ: {supplier.contactPerson}</p>
                                        )}
                                    </div>
                                    <Badge className={supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {supplier.isActive ? 'Đang hoạt động' : 'Ngừng'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {supplier.phone && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Điện thoại</label>
                                            <p className="text-base text-gray-900">{supplier.phone}</p>
                                        </div>
                                    )}
                                    {supplier.email && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Email</label>
                                            <p className="text-base text-gray-900">{supplier.email}</p>
                                        </div>
                                    )}
                                    {supplier.leadTimeDays && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Thời gian giao</label>
                                            <p className="text-base text-gray-900">{supplier.leadTimeDays} ngày</p>
                                        </div>
                                    )}
                                    {supplier.paymentTerms && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Điều khoản thanh toán</label>
                                            <p className="text-base text-gray-900">{supplier.paymentTerms}</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </TabsContent>

                    {/* Tab 3: Inventory */}
                    <TabsContent value="inventory" className="space-y-4">
                        {mockInventory.map((inv) => (
                            <Card key={inv.id} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{inv.branchName}</h3>
                                        <p className="text-sm text-gray-600">{inv.storageLocation}</p>
                                    </div>
                                    <Badge
                                        className={
                                            inv.status === 'adequate'
                                                ? 'bg-green-100 text-green-800'
                                                : inv.status === 'low'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                        }
                                    >
                                        {inv.status === 'adequate' ? 'Đủ hàng' : inv.status === 'low' ? 'Sắp hết' : 'Hết hàng'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Tồn kho hiện tại</label>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {inv.currentStock} {inv.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Ngưỡng tối thiểu</label>
                                        <p className="text-xl font-semibold text-yellow-600">
                                            {inv.minStock} {inv.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Tổng giá trị</label>
                                        <p className="text-xl font-semibold text-green-600">
                                            {(inv.totalValue / 1000000).toFixed(1)}M
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">Mức độ tồn kho</span>
                                        <span className="font-semibold text-gray-900">
                                            {Math.round((inv.currentStock / inv.maxStock) * 100)}%
                                        </span>
                                    </div>
                                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full ${inv.status === 'adequate'
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                    : inv.status === 'low'
                                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                                                }`}
                                            style={{ width: `${Math.min((inv.currentStock / inv.maxStock) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>

                    {/* Tab 4: Batches */}
                    <TabsContent value="batches" className="space-y-4">
                        {mockBatches.map((batch) => (
                            <Card key={batch.id} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Lô: {batch.batchNumber}</h3>
                                        {batch.lotNumber && (
                                            <p className="text-sm text-gray-600">Lot: {batch.lotNumber}</p>
                                        )}
                                    </div>
                                    <Badge
                                        className={
                                            batch.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }
                                    >
                                        {batch.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Số lượng ban đầu</label>
                                        <p className="text-xl font-semibold text-gray-900">
                                            {batch.quantity} {batch.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Còn lại</label>
                                        <p className="text-xl font-semibold text-green-600">
                                            {batch.remainingQuantity} {batch.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Tổng chi phí</label>
                                        <p className="text-xl font-semibold text-blue-600">
                                            {(batch.totalCost / 1000000).toFixed(1)}M
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Ngày nhận</label>
                                        <p className="text-sm text-gray-900">
                                            {new Date(batch.receivedDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    {batch.expiryDate && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Hạn sử dụng</label>
                                            <p className="text-sm text-gray-900">
                                                {new Date(batch.expiryDate).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Nhà cung cấp</label>
                                        <p className="text-sm text-gray-900">{batch.supplierName}</p>
                                    </div>
                                </div>
                                {batch.qualityCheckPassed && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                        <CheckCircle className="text-green-600" size={18} />
                                        <span className="text-sm font-semibold text-green-900">
                                            Đã qua kiểm tra chất lượng
                                        </span>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
