'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    getCustomerInformation,
    saveCustomerInformation,
    deleteCustomerInformation,
    updateCustomerInformation,
} from '@/apis/user.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { MapPin, Plus, Star, Loader2, Trash2, Edit2 } from 'lucide-react';
import { AddressAutocomplete } from '@/components/common/address-autocomplete';

interface CustomerInformation {
    informationId: number;
    userId: number | null;
    fullName: string;
    address: string;
    phone: string;
    isDefault: boolean;
}

interface AddressManagementSectionProps {
    userId: number;
}

export default function AddressManagementSection({ userId }: AddressManagementSectionProps) {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<CustomerInformation | null>(null);
    const [deletingInformationId, setDeletingInformationId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        isDefault: false,
    });

    const {
        data: addressesResponse,
        isLoading: isLoadingAddresses,
        refetch: refetchAddresses,
    } = useQuery({
        queryKey: ['customer-informations', userId],
        queryFn: () => getCustomerInformation(userId),
        enabled: Boolean(userId),
        refetchOnWindowFocus: false,
    });

    const addresses: CustomerInformation[] = Array.isArray(addressesResponse?.data)
        ? addressesResponse.data
        : Array.isArray(addressesResponse)
            ? addressesResponse
            : [];

    const saveAddressMutation = useMutation({
        mutationFn: (payload: {
            userId: number;
            name: string;
            address: string;
            phoneNumber: string;
            isDefault: boolean;
        }) => saveCustomerInformation(payload),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['customer-informations', userId] });
            await refetchAddresses();
            setIsDialogOpen(false);
            setEditingAddress(null);
            setFormData({
                name: '',
                address: '',
                phoneNumber: '',
                isDefault: false,
            });
            toast.success('Thêm địa chỉ thành công!', {
                position: 'top-center',
                autoClose: 3000,
            });
        },
        onError: (error: unknown) => {
            const errorMessage =
                (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
                (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message ||
                'Không thể thêm địa chỉ. Vui lòng thử lại.';
            toast.error(errorMessage, {
                position: 'top-center',
                autoClose: 4000,
            });
        },
    });

    const deleteAddressMutation = useMutation({
        mutationFn: ({ userId, informationId }: { userId: number; informationId: number }) =>
            deleteCustomerInformation(userId, informationId),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['customer-informations', userId] });
            await refetchAddresses();
            setDeletingInformationId(null);
        },
        onError: () => {
            // Silent error handling
            setDeletingInformationId(null);
        },
    });

    const updateAddressMutation = useMutation({
        mutationFn: (payload: {
            userId: number;
            informationId: number;
            name: string;
            address: string;
            phoneNumber: string;
            isDefault: boolean;
        }) => updateCustomerInformation(payload),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['customer-informations', userId] });
            await refetchAddresses();
            setIsDialogOpen(false);
            setEditingAddress(null);
            setFormData({
                name: '',
                address: '',
                phoneNumber: '',
                isDefault: false,
            });
            // toast.success('Cập nhật địa chỉ thành công!', {
            //     position: 'top-center',
            //     autoClose: 3000,
            // });
        },
        onError: (error: unknown) => {
            const errorMessage =
                (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
                (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message ||
                'Không thể cập nhật địa chỉ. Vui lòng thử lại.';
            toast.error(errorMessage, {
                position: 'top-center',
                autoClose: 4000,
            });
        },
    });

    const handleDelete = (informationId: number) => {
        setDeletingInformationId(informationId);
        deleteAddressMutation.mutate({ userId, informationId });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.address.trim() || !formData.phoneNumber.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin', {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }

        const isDefaultValue = addresses.length === 0 || formData.isDefault;

        if (editingAddress) {
            updateAddressMutation.mutate({
                userId,
                informationId: editingAddress.informationId,
                name: formData.name.trim(),
                address: formData.address.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                isDefault: isDefaultValue,
            });
        } else {
            saveAddressMutation.mutate({
                userId,
                name: formData.name.trim(),
                address: formData.address.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                isDefault: isDefaultValue,
            });
        }
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setFormData({
            name: '',
            address: '',
            phoneNumber: '',
            isDefault: addresses.length === 0,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (address: CustomerInformation) => {
        setEditingAddress(address);
        setFormData({
            name: address.fullName,
            address: address.address,
            phoneNumber: address.phone,
            isDefault: address.isDefault,
        });
        setIsDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setIsDialogOpen(false);
            setEditingAddress(null);
            setFormData({
                name: '',
                address: '',
                phoneNumber: '',
                isDefault: false,
            });
        }
    };

    return (
        <>
            <Card className='bg-transparent shadow-none border-0'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <MapPin className='h-5 w-5' />
                        Địa chỉ của bạn
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {/* Add New Address Button */}
                    <Button
                        onClick={handleAddNew}
                        className='w-full sm:w-auto bg-[#EC6426] hover:bg-[#C04A00] text-white'
                    >
                        <Plus className='h-4 w-4 mr-2' />
                        Thêm địa chỉ mới
                    </Button>

                    {/* Addresses List */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>Danh sách địa chỉ đã lưu</h3>
                        {isLoadingAddresses ? (
                            <div className='text-center py-8'>
                                <Loader2 className='h-8 w-8 animate-spin mx-auto text-[#EC6426]' />
                                <p className='mt-2 text-sm text-gray-500'>Đang tải địa chỉ...</p>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className='text-center py-8 border-2 border-dashed border-gray-300 rounded-lg'>
                                <MapPin className='h-12 w-12 mx-auto text-gray-400 mb-3' />
                                <p className='text-gray-500'>Chưa có địa chỉ nào được lưu</p>
                                <p className='text-sm text-gray-400 mt-1'>Nhấn &ldquo;Thêm địa chỉ mới&rdquo; để bắt đầu</p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {addresses.map((address) => (
                                    <Card
                                        key={address.informationId}
                                        className={`relative shadow-md ${address.isDefault ? 'border-2 border-[#EC6426] bg-orange-50/70' : 'border bg-white/90'
                                            }`}
                                    >
                                        <CardContent className='pt-6 pt-0'>
                                            <div className='space-y-3'>
                                                <div className='flex items-start justify-between'>
                                                    <div className='flex-1'>
                                                        <div className='flex items-center gap-2 mb-2'>
                                                            <h4 className='font-semibold text-lg'>{address.fullName}</h4>
                                                            {address.isDefault && (
                                                                <span className='inline-flex items-center gap-1 px-2 py-1 bg-[#EC6426] text-white text-xs font-semibold rounded-full'>
                                                                    <Star className='h-3 w-3 fill-white' />
                                                                    Mặc định
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className='text-sm text-gray-600 mb-2'>{address.address}</p>
                                                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                                                            <span className='font-medium'>SĐT:</span>
                                                            <span>{address.phone}</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <Button
                                                            type='button'
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={() => handleEdit(address)}
                                                            className='h-8 w-8 p-0 text-[#EC6426] hover:text-[#C04A00] hover:bg-orange-50'
                                                            aria-label='Chỉnh sửa địa chỉ'
                                                        >
                                                            <Edit2 className='h-4 w-4' />
                                                        </Button>
                                                        <Button
                                                            type='button'
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={() => handleDelete(address.informationId)}
                                                            disabled={deletingInformationId === address.informationId}
                                                            className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'
                                                            aria-label='Xóa địa chỉ'
                                                        >
                                                            {deletingInformationId === address.informationId ? (
                                                                <Loader2 className='h-4 w-4 animate-spin' />
                                                            ) : (
                                                                <Trash2 className='h-4 w-4' />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Address Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-visible p-0'>
                    <div className='p-6 max-h-[85vh] overflow-y-auto'>
                        <DialogHeader className='animate-in fade-in-0 slide-in-from-top-2 duration-300'>
                            <DialogTitle className='text-xl font-bold'>
                                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className='space-y-4 mt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-75'>
                            <div>
                                <Label htmlFor='dialog-name' className='text-sm font-semibold'>
                                    Tên địa chỉ <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='dialog-name'
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder='Ví dụ: Nhà riêng, Công ty, Ký túc xá...'
                                    className='mt-1'
                                    required
                                />
                            </div>

                            <div className='relative overflow-visible'>
                                <Label htmlFor='dialog-address' className='text-sm font-semibold'>
                                    Địa chỉ <span className='text-red-500'>*</span>
                                </Label>
                                <div className='mt-1 relative overflow-visible z-[60]'>
                                    <AddressAutocomplete
                                        value={formData.address}
                                        onChange={(address) => setFormData({ ...formData, address })}
                                        placeholder='Nhập địa chỉ chi tiết...'
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor='dialog-phoneNumber' className='text-sm font-semibold'>
                                    Số điện thoại <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='dialog-phoneNumber'
                                    type='tel'
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder='Nhập số điện thoại'
                                    className='mt-1'
                                    required
                                />
                            </div>

                            <div className='flex items-center gap-2'>
                                <input
                                    type='checkbox'
                                    id='dialog-isDefault'
                                    checked={addresses.length === 0 || formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    className='h-4 w-4 rounded border-gray-300 text-[#EC6426] focus:ring-[#EC6426]'
                                    aria-label='Đặt làm địa chỉ mặc định'
                                />
                                <Label htmlFor='dialog-isDefault' className='text-sm font-medium cursor-pointer'>
                                    Đặt làm địa chỉ mặc định
                                </Label>
                            </div>

                            <div className='flex gap-3 pt-2'>
                                <Button
                                    type='submit'
                                    disabled={saveAddressMutation.isPending || updateAddressMutation.isPending}
                                    className='flex-1 bg-[#EC6426] hover:bg-[#C04A00] text-white'
                                >
                                    {(saveAddressMutation.isPending || updateAddressMutation.isPending) ? (
                                        <>
                                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                            Đang lưu...
                                        </>
                                    ) : editingAddress ? (
                                        'Cập nhật địa chỉ'
                                    ) : (
                                        'Lưu địa chỉ'
                                    )}
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => handleDialogClose(false)}
                                    className='flex-1'
                                >
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

