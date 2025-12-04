'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { X, Loader2, Image as ImageIcon, Plus, ChefHat, CheckCircle } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

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
import { getMaterials, Material } from '@/apis/material.api';
import { getCookingMethods, CookingMethod } from '@/apis/cooking-method.api';
import { getUnits, Unit } from '@/apis/unit.api';
import { uploadMediaToSupabase } from '@/components/common/upFileToSupabase';
import { ProductRecipeStepItem } from './ProductRecipeStepItem';
import { useBodyScrollLock } from '../../components/useBodyScrollLock';

const PRODUCT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET || 'images_t';

const productSchema = z.object({
    name: z.string().min(1, 'Tên sản phẩm không được để trống'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    imageUrl: z.string().optional(),
    typeId: z.coerce.number().min(1, 'Vui lòng chọn loại sản phẩm'),
    recipesRequests: z.array(z.object({
        materialId: z.number().min(1, 'Chọn nguyên liệu'),
        quantity: z.coerce.number().min(0.0001, 'Số lượng phải > 0'),
        orderStep: z.number().optional(),
        cookingMethodId: z.number().min(0, 'Chọn phương pháp nấu'),
    })).optional(),
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
    useBodyScrollLock(open);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [cookingMethods, setCookingMethods] = useState<CookingMethod[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
            typeId: 0,
            recipesRequests: [],
        },
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'recipesRequests',
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((item) => item.id === active.id);
            const newIndex = fields.findIndex((item) => item.id === over.id);
            move(oldIndex, newIndex);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [types, materialsData, cookingMethodsData, unitsData] = await Promise.all([
                    getProductType(),
                    getMaterials({ size: 1000 }),
                    getCookingMethods({ size: 1000 }),
                    getUnits(),
                ]);
                setProductTypes(types.filter(t => t.id !== 0));
                setMaterials(materialsData.data.content);
                setCookingMethods(cookingMethodsData.content);
                setUnits(unitsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Không thể tải dữ liệu');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (open) {
            if (product) {
                let typeId = product.productTypeId || 0;

                // Fallback: try to find typeId by name if it's 0 or missing
                if (!typeId && product.productType && productTypes.length > 0) {
                    const foundType = productTypes.find(t => t.name === product.productType);
                    if (foundType) {
                        typeId = foundType.id;
                    }
                }

                reset({
                    name: product.productName,
                    description: product.productDescription,
                    price: product.productPrice,
                    imageUrl: product.productImage || '',
                    typeId: typeId,
                    recipesRequests: [],
                });
                setPreviewUrl(product.productImage || null);

                // Fetch recipes
                import('@/apis/recipe.api').then(({ getRecipesByProductId }) => {
                    getRecipesByProductId(product.productId).then(recipes => {
                        const formattedRecipes = recipes.sort((a: any, b: any) => a.orderStep - b.orderStep).map((r: any) => ({
                            materialId: r.materialId,
                            quantity: r.quantity,
                            orderStep: r.orderStep,
                            cookingMethodId: r.cookingMethodId
                        }));
                        setValue('recipesRequests', formattedRecipes);
                    }).catch(err => console.error("Failed to load recipes", err));
                });

            } else {
                reset({
                    name: '',
                    description: '',
                    price: 0,
                    imageUrl: '',
                    typeId: 0,
                    recipesRequests: [],
                });
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [open, product, reset, setValue, productTypes]);

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
                name: data.name,
                description: data.description,
                price: data.price,
                imageUrl: finalImageUrl || '',
                typeId: data.typeId,
                recipesRequests: data.recipesRequests?.map((r, index) => ({
                    materialId: r.materialId,
                    quantity: r.quantity,
                    orderStep: index + 1,
                    cookingMethodId: r.cookingMethodId,
                })) || [],
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
            <DialogContent className="sm:max-w-[1000px] max-h-[95vh] overflow-y-auto flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl [&>button]:hidden">
                {/* Header */}
                <div className="bg-[#78A243] p-5 flex items-center justify-between shrink-0 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            {product ? <ChefHat className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                        </div>
                        <DialogTitle className="text-xl font-bold text-white">
                            {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                        </DialogTitle>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
                    <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column: Basic Info */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-gray-800 border-b pb-2">Thông tin cơ bản</h3>

                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <Label>Hình ảnh</Label>
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400">
                                                        <ImageIcon className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                                                        <span className="text-xs">Nhấn để tải ảnh</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Tên sản phẩm <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            placeholder="Nhập tên sản phẩm"
                                            {...register('name')}
                                            className={`focus:border-[#78A243] focus:ring-[#78A243]/20 ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Giá bán (VNĐ) <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="0"
                                            {...register('price')}
                                            className={`focus:border-[#78A243] focus:ring-[#78A243]/20 ${errors.price ? 'border-red-500' : ''}`}
                                        />
                                        {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                                    </div>

                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="typeId">Loại sản phẩm <span className="text-red-500">*</span></Label>
                                        <Controller
                                            control={control}
                                            name="typeId"
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                                    value={field.value ? field.value.toString() : undefined}
                                                >
                                                    <SelectTrigger className={`focus:border-[#78A243] focus:ring-[#78A243]/20 ${errors.typeId ? 'border-red-500' : ''}`}>
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
                                            )}
                                        />
                                        {errors.typeId && <p className="text-xs text-red-500">{errors.typeId.message}</p>}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Mô tả <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Mô tả chi tiết sản phẩm"
                                            {...register('description')}
                                            className={`focus:border-[#78A243] focus:ring-[#78A243]/20 ${errors.description ? 'border-red-500' : ''}`}
                                            rows={3}
                                        />
                                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Recipes */}
                            <div className="lg:col-span-8 space-y-4 flex flex-col h-full">
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex-grow flex flex-col">
                                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                                        <h3 className="font-semibold text-gray-800">Công thức món ăn</h3>
                                        <Button
                                            type="button"
                                            onClick={() => append({ materialId: 0, quantity: 1, cookingMethodId: 0 })}
                                            size="sm"
                                            className="bg-[#78A243]/10 text-[#78A243] border border-[#78A243]/30 hover:bg-[#78A243]/20"
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Thêm nguyên liệu
                                        </Button>
                                    </div>

                                    <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                        {fields.length === 0 ? (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                                <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">Chưa có nguyên liệu nào trong công thức</p>
                                                <Button
                                                    type="button"
                                                    onClick={() => append({ materialId: 0, quantity: 1, cookingMethodId: 0 })}
                                                    variant="link"
                                                    className="text-[#78A243]"
                                                >
                                                    Thêm nguyên liệu đầu tiên
                                                </Button>
                                            </div>
                                        ) : (
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragEnd={handleDragEnd}
                                            >
                                                <SortableContext
                                                    items={fields.map(f => f.id)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    <div className="space-y-3">
                                                        {fields.map((field, index) => (
                                                            <ProductRecipeStepItem
                                                                key={field.id}
                                                                id={field.id}
                                                                index={index}
                                                                control={control}
                                                                register={register}
                                                                setValue={setValue}
                                                                remove={remove}
                                                                materials={materials}
                                                                cookingMethods={cookingMethods}
                                                                units={units}
                                                                errors={errors}
                                                            />
                                                        ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 shrink-0 rounded-b-2xl flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="px-5 py-2.5 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {product ? 'Cập nhật' : 'Tạo mới'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
