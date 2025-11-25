'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { X, Save, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import {
    Product,
    ProductCreateRequest,
    createProduct,
    updateProduct,
    getProductType,
    ProductType
} from '@/apis/product.api';
import { uploadMediaToSupabase } from '@/components/common/upFileToSupabase';

const PRODUCT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET || 'images_t';

const productSchema = z.object({
    name: z.string().min(1, 'Tên sản phẩm không được để trống'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    imageUrl: z.string().optional(),
    typeId: z.coerce.number().min(1, 'Vui lòng chọn loại sản phẩm'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onSuccess: () => void;
}

export function ProductForm({ open, onOpenChange, product, onSuccess }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
            typeId: 0,
        },
    });

    const currentImageUrl = watch('imageUrl');

    useEffect(() => {
        fetchProductTypes();
    }, []);

    useEffect(() => {
        if (open) {
            if (product) {
                reset({
                    name: product.productName,
                    description: product.productDescription,
                    price: product.productPrice,
                    imageUrl: product.productImage || '',
                    typeId: product.productTypeId || 0,
                });
                setPreviewUrl(product.productImage || null);
            } else {
                reset({
                    name: '',
                    description: '',
                    price: 0,
                    imageUrl: '',
                    typeId: 0,
                });
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [open, product, reset]);

    const fetchProductTypes = async () => {
        try {
            const types = await getProductType();
            setProductTypes(types.filter(t => t.id !== 0));
        } catch (error) {
            console.error('Failed to fetch product types:', error);
            toast.error('Không thể tải danh sách loại sản phẩm');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File ảnh không được vượt quá 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh hợp lệ');
                return;
            }
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            // Cleanup previous object URL if needed
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
            setLoading(true);
            let finalImageUrl = data.imageUrl;

            if (selectedFile) {
                try {
                    const uploadResult = await uploadMediaToSupabase({
                        bucket: PRODUCT_BUCKET,
                        file: selectedFile,
                        folder: 'products',
                    });
                    finalImageUrl = uploadResult.publicUrl;
                } catch (uploadError) {
                    console.error('Upload failed:', uploadError);
                    toast.error('Không thể tải ảnh lên. Vui lòng thử lại.');
                    setLoading(false);
                    return;
                }
            }

            const requestData: ProductCreateRequest = {
                ...data,
                imageUrl: finalImageUrl || '',
                recipesRequests: [],
            };

            if (product) {
                await updateProduct(product.productId, requestData);
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await createProduct(requestData);
                toast.success('Thêm sản phẩm thành công');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save product:', error);
            toast.error('Có lỗi xảy ra khi lưu sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="space-y-4">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Hình ảnh sản phẩm</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Hỗ trợ: JPG, PNG, WEBP (Max 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên sản phẩm <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                placeholder="Nhập tên sản phẩm"
                                {...register('name')}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="description"
                                placeholder="Mô tả chi tiết sản phẩm"
                                {...register('description')}
                                className={errors.description ? 'border-red-500' : ''}
                                rows={3}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price">Giá bán (VNĐ) <span className="text-red-500">*</span></Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0"
                                    {...register('price')}
                                    className={errors.price ? 'border-red-500' : ''}
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <Label htmlFor="typeId">Loại sản phẩm <span className="text-red-500">*</span></Label>
                                <Select
                                    onValueChange={(value) => setValue('typeId', parseInt(value))}
                                    defaultValue={product?.productTypeId?.toString()}
                                >
                                    <SelectTrigger className={errors.typeId ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Chọn loại sản phẩm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.typeId && <p className="text-sm text-red-500">{errors.typeId.message}</p>}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] text-white hover:opacity-90"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Lưu sản phẩm
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
