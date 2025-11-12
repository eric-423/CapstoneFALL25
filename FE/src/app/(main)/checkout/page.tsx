'use client';

import { createOrderApiRoute, CreateOrderPayload } from '@/apis/order.api';
import { getCustomerInformation } from '@/apis/user.api';
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
import { setCookie, getToken, getAccessToken } from '@/utils/cookies';
import { useCookies } from 'react-cookie';

import { getReceiveTime } from '@/utils/getReceiveTime';
import { STORE_INFO } from '@/utils/mockupData';


// auto complete 
import { AddressAutocomplete } from '@/components/common/address-autocomplete';



type Branch = {
    branchId: number;
    branchName: string;
    address: string;
    phone: string;
    isActive: boolean;
};

type CustomerInformation = {
    informationId: number;
    fullName: string;
    address: string;
    phone: string;
    isDefault: boolean;
};

type CustomerInformationResponse = {
    informationId: number;
    fullName: string;
    address: string;
    phone: string;
    isDefault: boolean;
};

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
} from 'lucide-react';


import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import CheckoutSection from './components/checkout-section';
import { CheckoutFormData, checkoutSchema } from './schema';

export default function CheckoutPage() {
    useScrollTop();
    const { items, getTotalPrice } = useCart();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const tokenFullName = user?.fullName?.trim();
    const isMountedRef = useRef(false);
    const skipAutoSelectRef = useRef(false);

    // Lấy token từ nhiều nguồn giống như useAuth hook
    const [cookies] = useCookies([configs.cookies.accessToken, configs.cookies.refreshToken, 'token']);
    const getAuthToken = useCallback(() => {
        // Thử lấy từ localStorage trước
        if (typeof window !== 'undefined') {
            const localStorageToken = localStorage.getItem('access_token');
            if (localStorageToken) return localStorageToken;
        }
        // Thử lấy từ cookies
        return cookies['token'] || cookies[configs.cookies.accessToken] || getToken() || getAccessToken();
    }, [cookies]);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [selectedInfoId, setSelectedInfoId] = useState<number | 'new' | null>(null);
    const [shippingFee, setShippingFee] = useState<number | null>(null);
    const [isFetchingShippingFee, setIsFetchingShippingFee] = useState(false);





    useEffect(() => {
        const savedBranch = localStorage.getItem('selectedBranch');
        if (savedBranch) {
            try {
                const parsedBranch = JSON.parse(savedBranch);
                setSelectedBranch(parsedBranch);
            } catch {

                setSelectedBranch(null);
            }
        }
    }, []);



    useEffect(() => {
        if (isAuthLoading) return;

        const token = getToken();

        if (!token && !isAuthenticated) {
            const currentPath = window.location.pathname;
            router.replace(`${configs.routes.login}?callbackUrl=${encodeURIComponent(currentPath)}`);
        }

    }, [isAuthLoading, isAuthenticated, router]);



    const { data: customerInformationData = [], isLoading: isLoadingCustomerInfos } = useQuery({
        queryKey: ['customer-informations', user?.id],
        queryFn: () => getCustomerInformation(user?.id || 0),
        select: (data) => data.data ?? [],
        enabled: Boolean(user?.id),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });



    const customerInformations: CustomerInformation[] = useMemo(
        () =>
            Array.isArray(customerInformationData)
                ? customerInformationData.map((info: CustomerInformationResponse) => ({
                    informationId: info.informationId,
                    fullName: info.fullName,
                    address: info.address,
                    phone: info.phone,
                    isDefault: info.isDefault,
                }))
                : [],
        [customerInformationData],
    );


    const { mutate: createOrderMutate, isPending: isPlacingOrderPending } = useMutation({
        mutationFn: (payload: CreateOrderPayload) => createOrderApiRoute(payload),
        onSuccess: (response) => {
            setIsSubmitting(false);

            const paymentUrl = response?.data?.paymentUrl;

            // console.log(response.data.paymentUrl);

            if (paymentUrl && response?.data?.address) {
                toast.success('Đặt hàng thành công! Chuyển hướng đến thanh toán...');
                setCookie('is_paying', 'true');
                setTimeout(() => {
                    window.location.href = paymentUrl;
                }, 1000);
                return;
            }

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
            customerPhone: user?.phoneNumber ?? '',
            receiveTime: getDefaultReceiveTime(),
            deliveryAddress: '',
            paymentMethod: 'qr',
            note: '',
        },
    });


    useEffect(() => {
        if (user?.fullName) {
            form.setValue('customerName', user.fullName, { shouldValidate: true });
        }
    }, [form, user?.fullName]);


    useEffect(() => {
        if (!isMountedRef.current || !tokenFullName) return;
        const currentName = form.getValues('customerName')?.trim();
        const matchesAddressLabel = customerInformations.some(
            (info) => info.fullName?.trim().toLowerCase() === currentName?.toLowerCase(),
        );
        if (!currentName || matchesAddressLabel) {
            form.setValue('customerName', tokenFullName, { shouldValidate: true });
        }
    }, [customerInformations, form, tokenFullName]);


    useEffect(() => {
        if (!isMountedRef.current) return;
        if (!customerInformations.length) {
            if (!form.getValues('customerPhone') && user?.phoneNumber) {
                form.setValue('customerPhone', user.phoneNumber, { shouldValidate: true });
            }
            if (!form.getValues('customerName') && tokenFullName) {
                form.setValue('customerName', tokenFullName, { shouldValidate: true });
            }
            return;
        }

        const preferredInfo =
            customerInformations.find((info) => info.isDefault) ||
            customerInformations.find((info) => info.fullName?.trim().toLowerCase() === 'nhà riêng') ||
            customerInformations[0];


        if (preferredInfo) {
            if (!form.getValues('customerPhone')) {
                form.setValue('customerPhone', preferredInfo.phone || user?.phoneNumber || '', { shouldValidate: true });
            }
            if (!form.getValues('customerName') && tokenFullName) {
                form.setValue('customerName', tokenFullName, { shouldValidate: true });
            }
        }
    }, [customerInformations, form, tokenFullName, user?.phoneNumber]);



    const fulfillmentMethod = form.watch('fulfillmentMethod');
    const isDelivery = fulfillmentMethod === 'delivery';

    useEffect(() => {
        if (!isMountedRef.current) return;
        if (!isDelivery) return;
        if (!customerInformations.length) return;

        const preferredInfo =
            customerInformations.find((info) => info.isDefault) ||
            customerInformations.find((info) => info.fullName?.trim().toLowerCase() === 'nhà riêng') ||
            customerInformations[0];

        if (preferredInfo && selectedInfoId !== preferredInfo.informationId) {
            const timeout = setTimeout(() => {
                if (skipAutoSelectRef.current) return;
                setSelectedInfoId(preferredInfo.informationId);
                skipAutoSelectRef.current = true;
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [customerInformations, isDelivery, selectedInfoId]);

    // Đồng bộ danh sách địa chỉ đã lưu
    useEffect(() => {
        if (selectedInfoId !== null && selectedInfoId !== 'new') {
            const exists = customerInformations.some((info) => info.informationId === selectedInfoId);
            if (!exists) {
                setSelectedInfoId(null);
            }
        }
    }, [customerInformations, selectedInfoId]);

    useEffect(() => {
        if (!isMountedRef.current) return;
        if (!isDelivery) return;
        if (selectedInfoId === null || selectedInfoId === 'new') return;

        const info = customerInformations.find((item) => item.informationId === selectedInfoId);
        if (info) {
            const timeout = setTimeout(() => {
                form.setValue('deliveryAddress', info.address || '', { shouldValidate: true });
                form.setValue('customerPhone', info.phone || user?.phoneNumber || '', { shouldValidate: true });
                if (!form.getValues('customerName') && tokenFullName) {
                    form.setValue('customerName', tokenFullName, { shouldValidate: true });
                }
                skipAutoSelectRef.current = false;
            }, 0);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [customerInformations, form, isDelivery, selectedInfoId, tokenFullName, user?.phoneNumber]);

    useEffect(() => {
        if (!isMountedRef.current) return;
        if (selectedInfoId === 'new') {
            form.setValue('deliveryAddress', '', { shouldValidate: true });
            if (user?.phoneNumber) {
                form.setValue('customerPhone', user.phoneNumber, { shouldValidate: true });
            }
            if (tokenFullName) {
                form.setValue('customerName', tokenFullName, { shouldValidate: true });
            }
        }
        if (!isDelivery) {
            skipAutoSelectRef.current = false;
        }
    }, [form, isDelivery, selectedInfoId, tokenFullName, user?.phoneNumber]);

    const handleSelectSavedAddress = useCallback(
        (info: CustomerInformation) => {
            skipAutoSelectRef.current = true;
            setSelectedInfoId(info.informationId);
            form.setValue('deliveryAddress', info.address || '', { shouldValidate: true });
            form.setValue('customerPhone', info.phone || user?.phoneNumber || '', { shouldValidate: true });
            if (!form.getValues('customerName') && tokenFullName) {
                form.setValue('customerName', tokenFullName, { shouldValidate: true });
            }
        },
        [form, tokenFullName, user?.phoneNumber],
    );

    const handleAddNewAddress = useCallback(() => {
        skipAutoSelectRef.current = true;
        setSelectedInfoId('new');
        form.setValue('deliveryAddress', '', { shouldValidate: true });
        if (user?.phoneNumber) {
            form.setValue('customerPhone', user.phoneNumber, { shouldValidate: true });
        }
        form.setValue('customerName', user?.fullName || '', { shouldValidate: true });
        setShippingFee(null);
    }, [form, user?.phoneNumber, user?.fullName]);



    const deliveryAddressValue = useWatch({
        control: form.control,
        name: 'deliveryAddress',
    });


    const SHIPPING_DISTANCE_LIMIT_MESSAGE = 'Chúng tôi chỉ giao hàng trong phạm vi 5km.';

    const [errorShippingFee, setErrorShippingFee] = useState<string | null>(null);
    // lấy tiền shipping

    useEffect(() => {
        if (!isDelivery) {
            setShippingFee(null);
            setIsFetchingShippingFee(false);
            setErrorShippingFee(null);
            return;
        }

        const customerAddress = deliveryAddressValue?.trim();
        const branchAddr = (selectedBranch?.address || STORE_INFO.address || '').trim();

        if (!customerAddress || !branchAddr) {
            setShippingFee(null);
            setIsFetchingShippingFee(false);
            setErrorShippingFee(null);
            return;
        }

        if (customerAddress.length < 5) {
            setShippingFee(null);
            setIsFetchingShippingFee(false);
            setErrorShippingFee('Vui lòng nhập địa chỉ đầy đủ để tính phí giao hàng.');
            return;
        }

        const token = getAuthToken();
        if (!token) {
            setShippingFee(null);
            setIsFetchingShippingFee(false);
            setErrorShippingFee('Bạn cần đăng nhập để tính phí giao hàng.');
            return;
        }

        const controller = new AbortController();

        const timeoutId = window.setTimeout(async () => {
            try {
                setIsFetchingShippingFee(true);
                setErrorShippingFee(null);
                setShippingFee(null);

                const params = new URLSearchParams({
                    customerAddress,
                    branchAddress: branchAddr,
                });

                const response = await fetch(`https://tam-tac.com/api/orders/shipping/fee?${params.toString()}`, {
                    headers: {
                        accept: '*/*',
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                let responseBody: unknown = null;

                try {
                    responseBody = await response.json();
                } catch {
                    responseBody = null;
                }

                if (!response.ok) {
                    setShippingFee(null);
                    setErrorShippingFee(SHIPPING_DISTANCE_LIMIT_MESSAGE);
                    return;
                }

                const fee =
                    typeof (responseBody as { data?: number } | null)?.data === 'number'
                        ? (responseBody as { data: number }).data
                        : null;

                if (fee !== null) {
                    setShippingFee(fee);
                    setErrorShippingFee(null);
                } else {
                    setShippingFee(null);
                    setErrorShippingFee('Không thể xác định phí giao hàng cho địa chỉ này.');
                }
            } catch (error) {
                if ((error as Error).name === 'AbortError') return;
                setShippingFee(null);
                setErrorShippingFee('Không thể tính phí giao hàng. Vui lòng thử lại sau.');
            } finally {
                setIsFetchingShippingFee(false);
            }
        }, 800);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [deliveryAddressValue, getAuthToken, isDelivery, selectedBranch]);

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

    const onSubmit = async (data: CheckoutFormData) => {
        if (form.formState.isValidating || isPlacingOrderPending || isSubmitting) return;
        setIsSubmitting(true);

        try {


            const isPickup = data.fulfillmentMethod === 'pickup';
            const branchAddress = selectedBranch?.address || STORE_INFO.address;
            const shippingAddress = isPickup ? branchAddress : (data.deliveryAddress?.trim() || '');
            const payload: CreateOrderPayload = {
                customerId: user?.id,
                promotionCode: '',
                discountValue: 0,
                shippingAddress,
                shippingPhoneNumber: data.customerPhone,
                branchId: selectedBranch?.branchId || 1,
                mode: isPickup ? 'PICKUP' : 'SHIPPING',
                orderItemList: items.map((item) => ({
                    productId: item.productId,
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
        const isDeliveryAndLoading = isDelivery && isLoadingCustomerInfos;
        return items.length === 0 || isOrderSubmitting || !form.formState.isValid || isDeliveryAndLoading;
    }, [form.formState.isValid, isDelivery, isLoadingCustomerInfos, isOrderSubmitting, items.length]);


    const branchName = selectedBranch?.branchName || STORE_INFO.name;
    const branchAddress = selectedBranch?.address || STORE_INFO.address;
    const branchPhone = selectedBranch?.phone || STORE_INFO.phone;
    const orderSubtotal = getTotalPrice();
    const shippingFeeDisplay = useMemo(() => {
        if (!isDelivery) return '0đ';
        if (isFetchingShippingFee) return 'Đang tính...';
        if (errorShippingFee) return '—';
        if (shippingFee !== null) return `${shippingFee.toLocaleString()}đ`;
        return '0đ';
    }, [errorShippingFee, isDelivery, isFetchingShippingFee, shippingFee]);
    const totalWithShipping = isDelivery && shippingFee !== null ? orderSubtotal + shippingFee : orderSubtotal;

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




    if (isAuthLoading || (!isAuthenticated && typeof window !== 'undefined')) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            {(isOrderSubmitting || isLoadingCustomerInfos) && (
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
                                                                                <p className='text-sm text-muted-foreground'>Đến trực tiếp {branchName} để nhận món.</p>
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
                                                                        value={field.value}
                                                                        onChange={(date) => field.onChange(date)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='flex items-start text-sm text-medium ml-3 mt-2'>
                                                                <MapPin className='h-4 w-4 mr-2 mt-0.5 flex-shrink-0' />
                                                                <span className='font-medium'>
                                                                    {branchName}
                                                                    <p className='font-normal'>Cổng trước {branchAddress}</p>
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
                                                        <FormItem className='space-y-3'>
                                                            <div className='flex flex-wrap items-center justify-between gap-2'>
                                                                <FormLabel htmlFor='deliveryAddress' className='m-0 space-y-1'>
                                                                    <span className='block text-xs text-muted-foreground ps-2'>{branchName} – {branchAddress}</span>
                                                                </FormLabel>
                                                            </div>

                                                            {isLoadingCustomerInfos ? (
                                                                <p className='text-sm text-muted-foreground'>
                                                                    Đang tải địa chỉ giao hàng của bạn...
                                                                </p>
                                                            ) : customerInformations.length > 0 ? (
                                                                <>
                                                                    <div className='flex flex-wrap gap-2 items-center'>
                                                                        {customerInformations.map((info) => (
                                                                            <Button
                                                                                key={info.informationId}
                                                                                type='button'
                                                                                variant={
                                                                                    selectedInfoId === info.informationId ? 'default' : 'outline'
                                                                                }
                                                                                className='rounded-full text-xs md:text-sm'
                                                                                onClick={() => handleSelectSavedAddress(info)}
                                                                            >
                                                                                {info.fullName || `Địa chỉ ${info.informationId}`}
                                                                            </Button>
                                                                        ))}
                                                                        <Button
                                                                            type='button'
                                                                            variant='ghost'
                                                                            className='text-primary px-3'
                                                                            onClick={handleAddNewAddress}
                                                                        >
                                                                            + Thêm địa chỉ mới
                                                                        </Button>
                                                                    </div>



                                                                    {/* dùng auto chỗ nài nè  */}

                                                                    <AddressAutocomplete
                                                                        value={field.value ?? ''}
                                                                        onChange={(address) => {
                                                                            field.onChange(address);
                                                                            if (selectedInfoId !== 'new') {
                                                                                setSelectedInfoId('new');
                                                                            }
                                                                            if (address.trim().length === 0) {
                                                                                setShippingFee(null);
                                                                            }
                                                                        }}
                                                                        placeholder='Ví dụ: Số nhà, đường, phường/xã, quận/huyện, thành phố'
                                                                        rows={3}
                                                                    />





                                                                </>
                                                            ) : (
                                                                <p className='text-sm text-muted-foreground'>
                                                                    Bạn chưa có địa chỉ đã lưu. Vui lòng nhập địa chỉ giao hàng mới.
                                                                </p>
                                                            )}
                                                            {form.getFieldState(field.name).error && (
                                                                <p className='text-red-500 text-sm'>
                                                                    {form.getFieldState(field.name).error?.message}
                                                                </p>
                                                            )}
                                                        </FormItem>
                                                    )}
                                                ></FormField>


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
                                                            <RadioGroup value={field.value} onValueChange={field.onChange} className='space-y-2'>
                                                                <div className='flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white'>
                                                                    <RadioGroupItem value='qr' id='qr' />
                                                                    <Label htmlFor='qr' className='flex items-center cursor-pointer flex-1'>
                                                                        <div className='h-8 w-8 bg-[#1a1a1a] rounded-md flex items-center justify-center mr-3'>
                                                                            <QrCode className='h-5 w-5 text-white' />
                                                                        </div>
                                                                        <span>Quét mã QR</span>
                                                                    </Label>
                                                                </div>

                                                                {/* <div className='flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white'>
                                                                   
                                                                   <RadioGroupItem value='cash' id='cash' />
                                                                   
                                                                    <Label htmlFor='cash' className='flex items-center cursor-pointer flex-1'>
                                                                        <div className='h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center mr-3 text-primary'>
                                                                            <Wallet className='h-5 w-5' />
                                                                        </div>
                                                                        <span>Thanh toán tiền mặt</span>
                                                                    </Label>

                                                                </div> */}


                                                            </RadioGroup>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </CheckoutSection>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className='space-y-4'>
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
                                                    <span>{branchAddress}</span>
                                                </div>
                                                <div className='flex items-center gap-2 text-foreground'>
                                                    <Phone className='h-4 w-4 text-primary' />
                                                    <span>{branchPhone}</span>
                                                </div>
                                                {/* <p>
                                                    Nhận món trực tiếp tại cửa hàng <span className='font-medium'>{branchName}</span>. Bạn đã chọn{' '}
                                                    {paymentMethod === 'cash' ? 'thanh toán tiền mặt tại quầy.' : 'thanh toán qua QR ngay sau khi đặt hàng.'}
                                                </p> */}
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
                                                {/* <p>
                                                    Nhân viên sẽ liên hệ qua số điện thoại để xác nhận đơn, phí giao hàng và hỗ trợ{' '}
                                                    {paymentMethod === 'cash' ? 'thu tiền mặt khi giao món.' : 'thanh toán QR trước khi giao.'}
                                                </p> */}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Order Items */}
                                <Card className='p-4 gap-2'>
                                    <CardTitle className='m-2 mb-0'>Thông tin đơn hàng</CardTitle>
                                    <CardContent className='p-0 space-y-2'>
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


                                        {isDelivery && (
                                            <div className='flex items-center justify-between px-3 py-2 text-sm'>
                                                <span>Phí giao hàng dự kiến</span>
                                                <span
                                                    className={cn(
                                                        'font-medium',
                                                        errorShippingFee ? 'text-red-500' : 'text-primary',
                                                    )}
                                                >
                                                    {shippingFeeDisplay}
                                                </span>
                                            </div>
                                        )}

                                        {isDelivery && errorShippingFee && (
                                            <p className='px-3 pb-2 text-sm text-red-500'>{errorShippingFee}</p>
                                        )}

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
                                        <div className='flex justify-between text-sm text-muted-foreground'>
                                            <span>Tạm tính</span>
                                            <span>{orderSubtotal.toLocaleString()}đ</span>
                                        </div>

                                        {isDelivery && (
                                            <div className='flex justify-between text-sm text-muted-foreground'>
                                                <span>Phí giao hàng</span>
                                                <span className={cn('font-medium', errorShippingFee ? 'text-red-500' : 'text-primary')}>
                                                    {shippingFeeDisplay}
                                                </span>
                                            </div>
                                        )}

                                        {isDelivery && errorShippingFee && (
                                            <p className='text-xs text-red-500'>{errorShippingFee}</p>
                                        )}



                                        <div className='flex justify-between font-medium pt-1'>
                                            <span>TỔNG CỘNG</span>
                                            <span className='text-xl text-primary font-bold'>
                                                {totalWithShipping.toLocaleString()}đ
                                            </span>
                                        </div>
                                        {isDelivery && errorShippingFee && (
                                            <p className='text-xs text-muted-foreground'>Tổng chưa bao gồm phí giao hàng.</p>
                                        )}
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
            </div >
        </>
    );
}