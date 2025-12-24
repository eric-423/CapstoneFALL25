"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getComboById, type ComboDetail } from "@/apis/combo.api";
import type { Product } from "@/apis/product.api";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    Package,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AddToCartDialog } from "@/components/common/add-to-cart/add-to-cart-dialog";
import { AddToCartDrawer } from "@/components/common/add-to-cart/add-to-cart-drawer";
import { useIsMobile } from "@/utils/hooks/use-mobile";

export default function ComboDetailPage() {
    const params = useParams();
    const router = useRouter();
    const comboId = Number(params.id);
    const isMobile = useIsMobile();
    const [dialogOpen, setDialogOpen] = useState(false);

    const {
        data: combo,
        isLoading,
        error,
    } = useQuery<ComboDetail>({
        queryKey: ["combo-detail", comboId],
        queryFn: async () => {
            const result = await getComboById(comboId);
            return result;
        },
        enabled: !!comboId && !isNaN(comboId),
        retry: 1,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <LoadingSpinner />
                    <p className="text-sm text-gray-600">
                        Đang tải thông tin combo...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !combo) {
        return (
            <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-6 text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Không tìm thấy combo</h2>
                        <p className="text-gray-600 mb-4">
                            Combo không tồn tại hoặc đã bị xóa.
                        </p>
                        <Button onClick={() => router.push("/menu")} variant="default">
                            Quay lại menu
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const imageSrc = combo.imageUrl || "/placeholder.svg";

    const productLikeItem: Product & { isCombo: boolean; comboId: number } = {
        productId: 0,
        productName: combo.name,
        productDescription: combo.description,
        productImage: imageSrc,
        productPrice: combo.price,
        productType: "Combo",
        inStock: combo.active,
        comboId: combo.id,
        isCombo: true,
    };

    return (
        <div className="min-h-screen bg-[#FFFCF7] py-6 px-4">
            <div className="max-w-6xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4 hover:bg-orange-100"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>

                <div className="max-w-6xl mx-auto bg-[#FFFCF7] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-stretch">
                    <div className="relative w-full md:w-72 lg:w-80 aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-lg">
                        {imageSrc ? (
                            <Image
                                src={imageSrc}
                                alt={combo.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 40vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Package className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                        {!combo.active && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="bg-red-600 text-white font-bold text-lg px-4 py-2 rounded-lg">
                                    HẾT HÀNG
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {combo.name}
                            </h1>

                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-orange-600">
                                    {combo.price.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        </div>

                        {combo.description && (
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-gray-800">Mô tả</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {combo.description}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                {combo.active ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span className="text-green-600 font-semibold">
                                            Đang áp dụng
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-red-600 font-semibold">
                                            Không còn áp dụng
                                        </span>
                                    </>
                                )}
                            </div>
                            {combo.startDate && combo.endDate && (
                                <p className="text-sm text-gray-600">
                                    Thời gian:{" "}
                                    {new Date(combo.startDate).toLocaleDateString("vi-VN")} -{" "}
                                    {new Date(combo.endDate).toLocaleDateString("vi-VN")}
                                </p>
                            )}
                        </div>

                        {combo.comboItems && combo.comboItems.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    Món trong combo
                                </h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    {combo.comboItems.map((item) => (
                                        <li
                                            key={item.productId}
                                            className="flex justify-between"
                                        >
                                            <span>{item.note || `${item.productName}`}</span>
                                            <span className="font-medium mr-[35%] text-orange-500">× {item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-4 mx-auto w-full md:w-64">
                            <Button
                                size="lg"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-4 rounded-full"
                                onClick={() => setDialogOpen(true)}
                                disabled={!combo.active}
                            >
                                {combo.active ? "Thêm vào giỏ" : "Combo không còn áp dụng"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {dialogOpen && !isMobile && (
                <AddToCartDialog
                    product={productLikeItem}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                />
            )}
            {dialogOpen && isMobile && (
                <AddToCartDrawer
                    product={productLikeItem}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                />
            )}
        </div>
    );
}


