'use client';

import { createOrder, CreateOrderPayload } from '@/apis/order.api';
import { GET_ME_QUERY_KEY, getMe } from '@/apis/user.api';
import ControlledDateTimePicker from '@/components/common/controlled-date-time-picker';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { useCart } from '@/utils/contexts/cart/CartContext';
import { useAuth } from '@/utils/hooks';

import useScrollTop from '@/utils/hooks/useScrollTop';
import { cn } from '@/utils/lib/utils';

import configs from '@/utils/configs';
import { setCookie } from '@/utils/cookies';

import { getReceiveTime } from '@/utils/getReceiveTime';
import { STORE_INFO } from '@/utils/mockupData';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Clock,
    CreditCard,
    Loader2,
    MapPin,
    Phone,
    QrCode,
    ShieldCheck,
    ShoppingCart,
    Store,
    Truck,
    User,
    Wallet,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import CheckoutSection from './components/checkout-section';
import { CheckoutFormData, checkoutSchema } from './schema';

export default function CheckoutPage() {
    useScrollTop();
    const { items, getTotalPrice } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeRestriction, setTimeRestriction] = useState<number[]>([0, 15, 30]);

    const { data: userData, isLoading: isLoadingUserData } = useQuery({
        queryKey: [GET_ME_QUERY_KEY],
        queryFn: () => getMe(user?.id || 0),
        select: (data) => data.data.data,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { mutate: createOrderMutate, isPending: isPlacingOrderPending } = useMutation({
        mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
        onSuccess: (response) => {
            setIsSubmitting(false);

            const paymentUrl = response?.data?.payment_url || response?.payment_url;
            if (paymentUrl) {
                toast.success('Đặt hàng thành công! Chuyển hướng đến thanh toán...');
                setCookie('is_paying', 'true');
                setTimeout(() => {
                    window.location.href = paymentUrl;
                }, 1000);
                return;
            }

            toast.success('Đặt hàng thành công!');
        },
        onError: () => {
            toast.error('Không thể đặt hàng. Vui lòng thử lại sau.');
            setIsSubmitting(false);
        },
    });

    const getDefaultReceiveTime = useCallback(() => {
        const nextTime = getReceiveTime();
        return z.date().safeParse(nextTime).success ? nextTime : new Date();
    }, []);

    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        mode: 'onChange',
        defaultValues: {
            fulfillmentMethod: 'pickup',
            customerName: '',
            customerPhone: user?.phoneNumber,
            customerEmail: undefined,
            receiveTime: getDefaultReceiveTime(),
            deliveryAddress: '',
            paymentMethod: 'qr',
            note: '',
        },
    });

    useEffect(() => {
        if (userData) {
            const currentFulfillment = form.getValues('fulfillmentMethod') || 'pickup';
            const currentPaymentMethod = form.getValues('paymentMethod') || 'qr';
            const currentNote = form.getValues('note') || '';
            form.reset({
                fulfillmentMethod: currentFulfillment,
                customerName: userData.fullName || '',
                customerPhone: userData.phone || '',
                customerEmail: userData.email || undefined,
                receiveTime: currentFulfillment === 'pickup' ? getDefaultReceiveTime() : undefined,
                deliveryAddress: userData.address || '',
                paymentMethod: currentPaymentMethod,
                note: currentNote,
            });
        }
    }, [userData, form, getDefaultReceiveTime]);

    const fulfillmentMethod = form.watch('fulfillmentMethod');


    const deliveryAddressValue = form.watch('deliveryAddress');

    useEffect(() => {
        if (fulfillmentMethod === 'pickup') {
            const currentReceiveTime = form.getValues('receiveTime');
            if (!currentReceiveTime) {
                form.setValue('receiveTime', getDefaultReceiveTime(), { shouldValidate: true });
            }
            form.clearErrors('deliveryAddress');
        } else {
            if (form.getValues('receiveTime') !== undefined) {
                form.setValue('receiveTime', undefined, { shouldValidate: true });
            } else {
                form.clearErrors('receiveTime');
            }
        }
    }, [fulfillmentMethod, form, getDefaultReceiveTime]);

    function handleDateSelect(date: Date | undefined) {
        if (fulfillmentMethod !== 'pickup' || !date) return;

        const updatedDate = new Date(date);
        updatedDate.setHours(12, 0, 0, 0);
        form.setValue('receiveTime', updatedDate, { shouldValidate: true });
    }

    function handleTimeChange(type: 'hour' | 'minute', value: string) {
        if (fulfillmentMethod !== 'pickup') return;

        const currentDate = form.getValues('receiveTime') || getDefaultReceiveTime();
        const newDate = new Date(currentDate);

        if (type === 'hour') {
            const hour = parseInt(value, 10);
            newDate.setHours(hour);
            setTimeRestriction(hour === 11 ? [30, 45] : [0, 15, 30]);
            const minute = newDate.getMinutes();
            if (hour === 11 && minute < 30) newDate.setHours(hour, 30);
            else if (hour === 12 && minute > 30) newDate.setHours(12, 30);
            else newDate.setHours(hour);
        } else if (type === 'minute') {
            const minute = parseInt(value, 10);
            newDate.setMinutes(minute);
        }

        form.setValue('receiveTime', newDate, { shouldValidate: true });
    }

    const onSubmit = async (data: CheckoutFormData) => {
        if (form.formState.isValidating || isPlacingOrderPending || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const isPickup = data.fulfillmentMethod === 'pickup';
            const shippingAddress = isPickup ? STORE_INFO.address : (data.deliveryAddress?.trim() || '');
            const payload: CreateOrderPayload = {
                customerId: user?.id,
                promotionCode: '',
                discountValue: 0,
                shippingAddress,
                shippingPhoneNumber: data.customerPhone,
                branchId: 1,
                diningTableId: null,
                mode: isPickup ? 'PICKUP' : 'DELIVERY',
                orderItemList: items.map((item) => ({
                    productId: item.productId,
                    comboId: null,
                    quantity: item.quantity,
                    price: item.productPrice,
                    note: item.note || '',
                })),
            };

            createOrderMutate(payload);
        } catch (error) {
            console.error('Order submission error:', error);
            toast.error('Không thể đặt hàng. Vui lòng thử lại sau.');
        }
    };

    const isOrderSubmitting = isSubmitting || isPlacingOrderPending;
    const isOrderButtonDisabled = useMemo(() => {
        return items.length === 0 || isOrderSubmitting || !form.formState.isValid;
    }, [form.formState.isValid, isOrderSubmitting, items.length]);

    if (!items.length) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center'>
                <div className='flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary'>
                    <ShoppingCart className='h-8 w-8' />
                </div>
                <h2 className='text-2xl font-semibold'>Giỏ hàng của bạn đang trống</h2>
                <p className='text-muted-foreground max-w-md'>
                    Vui lòng quay lại thực đơn để chọn món trước khi tiếp tục thanh toán.
                </p>
                <Button onClick={() => router.push(configs.routes.menu)} className='bg-primary text-white hover:bg-primary/90'>
                    Quay lại thực đơn
                </Button>
            </div>
        );
    }




    return (
        <>
            {(isOrderSubmitting || isLoadingUserData) && (
                <div className='fixed inset-0 bg-foreground/30 flex items-center justify-center z-50'>
                    <div className='flex flex-col items-center justify-center space-y-4'>
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <div className={cn('min-h-screen py-8 px-4 md:px-30', isOrderSubmitting && 'opacity-50 pointer-events-none')}>
                <div className='container mx-auto max-w-6xl'>
                    <h1 className='text-3xl font-bold text-center mb-8'>Xác nhận đơn hàng</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                            {/* Left Column - Customer Information */}
                            <div className='lg:col-span-2 space-y-6'>
                                <Card>
                                    <CardContent className='space-y-6'>
                                        <CheckoutSection
                                            title='Thông tin khách hàng'
                                            className='mb-2'
                                            icon={<User className='h-5 w-5 text-primary' />}
                                        >
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                <FormField
                                                    control={form.control}
                                                    name='customerName'
                                                    render={({ field }) => (
                                                        <FormItem className='space-y-2'>
                                                            <FormLabel htmlFor='customerName'>Tên khách hàng</FormLabel>
                                                            <Input id='customerName' placeholder='Nhập tên của bạn' {...field} />
                                                            {form.getFieldState(field.name).error && (
                                                                <p className='text-red-500 text-sm'>{form.getFieldState(field.name).error?.message}</p>
                                                            )}
                                                        </FormItem>
                                                    )}
                                                ></FormField>
                                                <FormField
                                                    control={form.control}
                                                    name='customerPhone'
                                                    render={({ field }) => (
                                                        <FormItem className='space-y-2'>
                                                            <FormLabel htmlFor='customerPhone'>Số điện thoại</FormLabel>
                                                            <Input id='customerPhone' placeholder='Nhập số điện thoại' {...field} />
                                                            {form.getFieldState(field.name).error && (
                                                                <p className='text-red-500 text-sm'>{form.getFieldState(field.name).error?.message}</p>
                                                            )}
                                                        </FormItem>
                                                    )}
                                                ></FormField>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name='customerEmail'
                                                render={({ field }) => (
                                                    <FormItem className='space-y-2'>
                                                        <FormLabel htmlFor='customerEmail'>Email</FormLabel>
                                                        <Input
                                                            id='customerEmail'
                                                            type='email'
                                                            placeholder='Nhập email (không bắt buộc)'
                                                            {...field}
                                                            onChange={(e) => {
                                                                if (e.target.value.trim().length === 0) {
                                                                    field.onChange(undefined);
                                                                } else field.onChange(e);
                                                            }}
                                                        />
                                                        {form.getFieldState(field.name).error && (
                                                            <p className='text-red-500 text-sm'>{form.getFieldState(field.name).error?.message}</p>
                                                        )}
                                                    </FormItem>
                                                )}
                                            ></FormField>
                                        </CheckoutSection>

                                        <Separator className='my-6 bg-foreground/20' />

                                        <CheckoutSection
                                            title='Hình thức nhận hàng'
                                            className='mb-2'
                                            icon={<Store className='h-5 w-5 text-primary' />}
                                        >
                                            <FormField
                                                control={form.control}
                                                name='fulfillmentMethod'
                                                render={({ field }) => (
                                                    <FormItem className='space-y-3'>
                                                        <FormControl>
                                                            <RadioGroup value={field.value} onValueChange={field.onChange} className='space-y-2'>
                                                                <div className='flex items-start space-x-3 p-3 rounded-lg border border-gray-200 bg-white transition-colors'>
                                                                    <RadioGroupItem value='pickup' id='pickup' className='mt-1.5' />
                                                                    <Label htmlFor='pickup' className='flex-1 cursor-pointer'>
                                                                        <div className='flex items-center gap-3'>
                                                                            <Store className='h-5 w-5 text-primary' />
                                                                            <div>
                                                                                <p className='font-medium'>Nhận tại quán</p>
                                                                                <p className='text-sm text-muted-foreground'>Đến trực tiếp {STORE_INFO.name} để nhận món.</p>
                                                                            </div>
                                                                        </div>
                                                                    </Label>
                                                                </div>
                                                                <div className='flex items-start space-x-3 p-3 rounded-lg border border-gray-200 bg-white transition-colors'>
                                                                    <RadioGroupItem value='delivery' id='delivery' className='mt-1.5' />
                                                                    <Label htmlFor='delivery' className='flex-1 cursor-pointer'>
                                                                        <div className='flex items-center gap-3'>
                                                                            <Truck className='h-5 w-5 text-primary' />
                                                                            <div>
                                                                                <p className='font-medium'>Giao tận nơi</p>
                                                                                <p className='text-sm text-muted-foreground'>Ship đến địa chỉ bạn cung cấp.</p>
                                                                            </div>
                                                                        </div>
                                                                    </Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            ></FormField>
                                        </CheckoutSection>

                                        <Separator className='my-6 bg-foreground/20' />

                                        {fulfillmentMethod === 'pickup' ? (
                                            <CheckoutSection
                                                title='Thời gian nhận món'
                                                className='mb-2'
                                                icon={<Clock className='h-5 w-5 text-primary' />}
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name='receiveTime'
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col'>
                                                            <div className='flex items-center px-4'>
                                                                <FormLabel htmlFor='scheduled' className='mr-2'>
                                                                    Hẹn lịch nhận lúc
                                                                </FormLabel>
                                                                <div className='flex'>
                                                                    <ControlledDateTimePicker
                                                                        field={field.value}
                                                                        timeRestriction={timeRestriction}
                                                                        handleDateSelect={handleDateSelect}
                                                                        handleTimeChange={handleTimeChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='flex items-start text-sm text-medium ml-3 mt-2'>
                                                                <MapPin className='h-4 w-4 mr-2 mt-0.5 flex-shrink-0' />
                                                                <span className='font-medium'>
                                                                    {STORE_INFO.name} (gần Trà sữa BeTea)
                                                                    <p className='font-normal'>Cổng trước {STORE_INFO.address}</p>
                                                                </span>
                                                            </div>
                                                            {form.getFieldState('receiveTime').error && (
                                                                <p className='text-red-500 text-sm ml-3 mt-2'>
                                                                    {form.getFieldState('receiveTime').error?.message}
                                                                </p>
                                                            )}
                                                        </FormItem>
                                                    )}
                                                />
                                            </CheckoutSection>
                                        ) : (
                                            <CheckoutSection
                                                title='Địa chỉ giao hàng'
                                                className='mb-2'
                                                icon={<Truck className='h-5 w-5 text-primary' />}
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name='deliveryAddress'
                                                    render={({ field }) => (
                                                        <FormItem className='space-y-2'>
                                                            <FormLabel htmlFor='deliveryAddress'>Địa chỉ giao hàng</FormLabel>
                                                            <Textarea
                                                                id='deliveryAddress'
                                                                placeholder='Ví dụ: Số nhà, đường, phường/xã, quận/huyện, thành phố'
                                                                rows={3}
                                                                {...field}
                                                            />
                                                            {form.getFieldState(field.name).error && (
                                                                <p className='text-red-500 text-sm'>
                                                                    {form.getFieldState(field.name).error?.message}
                                                                </p>
                                                            )}
                                                        </FormItem>
                                                    )}
                                                ></FormField>
                                                <p className='text-sm text-muted-foreground'>
                                                    Nhân viên sẽ liên hệ để xác nhận và thông báo phí vận chuyển (nếu có).
                                                </p>
                                            </CheckoutSection>
                                        )}

                                        <Separator className='my-6 bg-foreground/20' />

                                        <CheckoutSection
                                            title='Phương thức thanh toán'
                                            className='mb-2'
                                            icon={<CreditCard className='h-5 w-5 text-primary' />}
                                        >
                                            <FormField
                                                control={form.control}
                                                name='paymentMethod'
                                                render={({ field }) => (
                                                    <FormItem className='space-y-3'>
                                                        <FormControl>
                                                            <RadioGroup
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                                className='space-y-2'
                                                            >
                                                                <div className='flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white'>
                                                                    <RadioGroupItem value='qr' id='qr' />
                                                                    <Label htmlFor='qr' className='flex items-center cursor-pointer flex-1'>
                                                                        <div className='h-8 w-8 bg-[#1a1a1a] rounded-md flex items-center justify-center mr-3'>
                                                                            <QrCode className='h-5 w-5 text-white' />
                                                                        </div>
                                                                        <span>Quét mã QR</span>
                                                                    </Label>
                                                                </div>
                                                                <div className='flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white'>
                                                                    <RadioGroupItem value='cash' id='cash' />
                                                                    <Label htmlFor='cash' className='flex items-center cursor-pointer flex-1'>
                                                                        <div className='h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center mr-3 text-primary'>
                                                                            <Wallet className='h-5 w-5' />
                                                                        </div>
                                                                        <span>Thanh toán tiền mặt</span>
                                                                    </Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </CheckoutSection>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className='space-y-4'>
                                {/* Fulfillment Summary */}
                                {fulfillmentMethod === 'pickup' ? (
                                    <Card>
                                        <CardContent className='p-4 space-y-4'>
                                            <div className='flex items-center gap-2'>
                                                <Store className='h-5 w-5 text-primary' />
                                                <CardTitle className='text-lg m-0'>Chi nhánh nhận món</CardTitle>
                                            </div>
                                            <div className='space-y-2 text-sm text-muted-foreground'>
                                                <div className='flex items-center gap-2 text-foreground'>
                                                    <MapPin className='h-4 w-4 text-primary' />
                                                    <span>{STORE_INFO.address}</span>
                                                </div>
                                                <div className='flex items-center gap-2 text-foreground'>
                                                    <Phone className='h-4 w-4 text-primary' />
                                                    <span>{STORE_INFO.phone}</span>
                                                </div>
                                                <p>
                                                    Nhận món trực tiếp tại cửa hàng <span className='font-medium'>{STORE_INFO.name}</span>.
                                                    Vui lòng đến quầy thu ngân để thanh toán và nhận món theo thời gian đã chọn.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardContent className='p-4 space-y-4'>
                                            <div className='flex items-center gap-2'>
                                                <Truck className='h-5 w-5 text-primary' />
                                                <CardTitle className='text-lg m-0'>Thông tin giao hàng</CardTitle>
                                            </div>
                                            <div className='space-y-2 text-sm text-muted-foreground'>
                                                <div className='flex items-start gap-2 text-foreground'>
                                                    <MapPin className='h-4 w-4 text-primary mt-0.5' />
                                                    <span>
                                                        {deliveryAddressValue?.trim()
                                                            ? deliveryAddressValue
                                                            : 'Vui lòng nhập địa chỉ giao hàng trong biểu mẫu bên trái.'}
                                                    </span>
                                                </div>
                                                <p>Nhân viên sẽ liên hệ qua số điện thoại để xác nhận đơn và phí giao hàng.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Order Items */}
                                <Card className='p-4 gap-2'>
                                    <CardTitle className='m-2 mb-0'>Thông tin đơn hàng</CardTitle>
                                    <CardContent className='p-0'>
                                        <div className='divide-y'>
                                            {items.map((item) => (
                                                <div key={item.productId} className='p-2 border-foreground/20'>
                                                    <div className='flex justify-between items-start'>
                                                        <div className='flex-1'>
                                                            <h5 className='font-medium text-sm'>{item.productName}</h5>
                                                            <p className='text-sm text-muted-foreground'>
                                                                {item.note && item.note.length > 0 ? (
                                                                    <>
                                                                        <span className='font-medium'>Ghi chú:</span> {item.note}
                                                                    </>
                                                                ) : (
                                                                    'Không có ghi chú'
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className='text-right text-sm'>
                                                            <div className='text-primary font-medium'>{item.productPrice.toLocaleString()}đ</div>x{' '}
                                                            {item.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className='p-4 gap-2'>
                                    <CardTitle className='m-2 mb-0'>Ghi chú cho đơn hàng</CardTitle>
                                    <CardContent className='p-0'>
                                        <FormField
                                            control={form.control}
                                            name='note'
                                            render={({ field }) => (
                                                <FormItem className='mt-1'>
                                                    <Textarea
                                                        id='note'
                                                        placeholder='Nhập ghi chú của bạn ở đây...'
                                                        {...field}
                                                        className='w-full resize-none h-20'
                                                    />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Order Summary */}
                                <Card>
                                    <CardContent className='p-4 py-0 space-y-3'>
                                        <div className='flex justify-between font-medium'>
                                            <span>TỔNG CỘNG</span>
                                            <span className='text-xl text-primary font-bold'>{getTotalPrice().toLocaleString()}đ</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className='px-4 py-0'>
                                        <Button
                                            type='submit'
                                            className='w-full h-12 bg-[#4CAF50] hover:bg-[#43A047] text-white rounded-lg font-medium'
                                            disabled={isOrderButtonDisabled}
                                        >
                                            {isOrderSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                            Đặt hàng
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Security Note */}
                                <div className='flex items-center justify-center text-sm text-muted-foreground'>
                                    <ShieldCheck className='h-4 w-4 mr-2' />
                                    <span>Thanh toán an toàn & bảo mật</span>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
}