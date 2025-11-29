'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Package, DollarSign, Store, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createCombo, updateCombo, type ComboDetail, type ComboItem, type CreateComboRequest, type UpdateComboRequest } from '@/apis/combo.api';
import { searchProducts, type Product, type ProductSearchParams } from '@/apis/product.api';
import { useAdminContext } from '@/utils/contexts/AdminContext';
import { useBodyScrollLock } from '../../components/useBodyScrollLock';
import { AdminSelect } from '../../components/AdminSelect';

interface ComboFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    combo?: ComboDetail | null;
    onSuccess: () => void;
}

export function ComboFormDialog({ open, onOpenChange, combo, onSuccess }: ComboFormDialogProps) {
    const { branches } = useAdminContext();
    const [loading, setLoading] = useState(false);
    useBodyScrollLock(open);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [branchId, setBranchId] = useState<number | null>(null);
    const [comboItems, setComboItems] = useState<ComboItem[]>([]);

    // Load products
    const fetchProducts = async (branchIdParam?: number) => {
        if (!branchIdParam) return;

        try {
            setLoadingProducts(true);
            const params: ProductSearchParams = {
                branchId: branchIdParam,
                isActive: true,
                page: 0,
                size: 1000,
            };
            const data = await searchProducts(params);
            setProducts(data.content);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Initialize form
    useEffect(() => {
        if (open) {
            if (combo) {
                // Edit mode
                setName(combo.name);
                setDescription(combo.description);
                setPrice(combo.price.toString());
                setStartDate(combo.startDate.split('T')[0]);
                setEndDate(combo.endDate.split('T')[0]);
                setIsActive(combo.active);
                setBranchId(combo.branchId);
                setComboItems(combo.comboItems || []);
            } else {
                // Create mode
                resetForm();
            }
        }
    }, [open, combo]);

    useEffect(() => {
        if (branchId) {
            fetchProducts(branchId);
        }
    }, [branchId]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setStartDate('');
        setEndDate('');
        setIsActive(true);
        setBranchId(branches.length > 0 ? parseInt(branches[0].id) : null);
        setComboItems([]);
    };

    const handleAddItem = () => {
        if (products.length === 0) return;

        setComboItems([...comboItems, {
            productId: products[0].productId,
            quantity: 1,
            note: '',
        }]);
    };

    const handleRemoveItem = (index: number) => {
        setComboItems(comboItems.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: keyof ComboItem, value: string | number) => {
        const newItems = [...comboItems];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newItems[index] = { ...newItems[index], [field]: value } as any;
        setComboItems(newItems);
    };

    const handleSubmit = async () => {
        if (!name.trim() || !description.trim() || !price || !startDate || !endDate || !branchId || comboItems.length === 0) {
            toast.warning('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                isActive,
                branchId,
                comboItems,
            };

            if (combo) {
                await updateCombo(combo.id, requestData as UpdateComboRequest);
                toast.success('Cập nhật combo thành công!');
            } else {
                await createCombo(requestData as CreateComboRequest);
                toast.success('Tạo combo mới thành công!');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save combo:', error);
            toast.error('Không thể lưu combo. Vui lòng thử lại!');
            alert('Không thể lưu combo');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white shadow-2xl rounded-2xl border-0 py-0">
                {/* Header */}
                <div className="sticky top-0 bg-[#78A243] p-6 flex items-center justify-between z-10 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {combo ? 'Chỉnh sửa combo' : 'Tạo combo mới'}
                            </h2>
                            <p className="text-sm text-white/80">
                                {combo ? 'Cập nhật thông tin combo' : 'Thêm combo mới vào hệ thống'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-sm"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="p-6 space-y-6">{/* Basic Info Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b-2 border-[#78A243]/20">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#78A243] to-[#DA7339] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">1</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#2D1E1A]">Thông tin cơ bản</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2D1E1A] flex items-center gap-1">
                                        Tên combo
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="VD: Combo cơm tấm 2 người"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                        Giá combo
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="110000"
                                            min="0"
                                            step="1000"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">VNĐ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                    Mô tả
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="VD: 2 phần cơm tấm sườn + 2 chanh muối"
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                        <Store className="h-4 w-4" />
                                        Chi nhánh
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <AdminSelect
                                        value={branchId?.toString() || ''}
                                        onValueChange={(value) => setBranchId(value ? parseInt(value) : null)}
                                        placeholder="Chọn chi nhánh"
                                        options={branches.map(branch => ({
                                            value: branch.id.toString(),
                                            label: branch.name,
                                            subLabel: branch.address || undefined,
                                        }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Ngày bắt đầu
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Ngày kết thúc
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-5 h-5 rounded border-2 border-green-400 text-green-600 focus:ring-2 focus:ring-green-200"
                                />
                                <label htmlFor="isActive" className="text-sm font-bold text-gray-900 cursor-pointer flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Kích hoạt combo ngay sau khi tạo
                                </label>
                            </div>
                        </div>

                        {/* Combo Items Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b-2 border-[#78A243]/20">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#78A243] to-[#78A243]/80 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">2</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Sản phẩm trong combo</h3>
                                <span className="text-red-500 text-sm font-bold">*</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Danh sách sản phẩm</p>
                                        <p className="text-xs text-gray-600">
                                            {comboItems.length > 0
                                                ? `Đã thêm ${comboItems.length} sản phẩm`
                                                : 'Chưa có sản phẩm nào'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleAddItem}
                                    size="sm"
                                    disabled={!branchId || loadingProducts}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm sản phẩm
                                </Button>
                            </div>

                            {loadingProducts ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <div className="w-12 h-12 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin mb-4"></div>
                                    <p className="text-sm font-semibold">Đang tải danh sách sản phẩm...</p>
                                </div>
                            ) : comboItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                        <Package className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 mb-1">Chưa có sản phẩm nào</p>
                                    <p className="text-xs text-gray-500 text-center max-w-md">
                                        Nhấn &quot;Thêm sản phẩm&quot; bên trên để thêm sản phẩm vào combo
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {comboItems.map((item, index) => {
                                        const product = products.find(p => p.productId === item.productId);
                                        return (
                                            <Card key={index} className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 hover:border-[#78A243] transition-all shadow-sm hover:shadow-md">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-[#78A243] to-[#78A243]/80 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white font-bold">{index + 1}</span>
                                                    </div>

                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                                                        <div className="md:col-span-5 space-y-1">
                                                            <label className="text-xs font-bold text-gray-700">Sản phẩm</label>
                                                            <AdminSelect
                                                                value={item.productId.toString()}
                                                                onValueChange={(value) => handleItemChange(index, 'productId', parseInt(value))}
                                                                options={products.map(product => ({
                                                                    value: product.productId.toString(),
                                                                    label: product.productName,
                                                                    subLabel: `${product.productPrice.toLocaleString('vi-VN')}đ`,
                                                                }))}
                                                            />
                                                        </div>

                                                        <div className="md:col-span-2 space-y-1">
                                                            <label className="text-xs font-bold text-gray-700">Số lượng</label>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                                                min="1"
                                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-semibold text-center focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20"
                                                            />
                                                        </div>

                                                        <div className="md:col-span-4 space-y-1">
                                                            <label className="text-xs font-bold text-gray-700">Ghi chú (tùy chọn)</label>
                                                            <input
                                                                type="text"
                                                                value={item.note || ''}
                                                                onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                                                                placeholder="VD: Không hành, nhiều rau..."
                                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20"
                                                            />
                                                        </div>

                                                        <div className="md:col-span-1 flex items-end">
                                                            <Button
                                                                onClick={() => handleRemoveItem(index)}
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-full text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {product && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                                                        <span className="text-gray-600">
                                                            Đơn giá: <span className="font-bold text-gray-900">{product.productPrice.toLocaleString('vi-VN')}đ</span>
                                                        </span>
                                                        <span className="text-gray-600">
                                                            Thành tiền: <span className="font-bold text-[#78A243]">{(product.productPrice * item.quantity).toLocaleString('vi-VN')}đ</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 p-6 flex gap-3 justify-end shadow-lg">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 font-semibold"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-3 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {combo ? 'Cập nhật combo' : 'Tạo combo'}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
