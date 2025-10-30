'use client';

import { GuestLayout } from '@/components/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerCustomer, sendOtp } from '@/apis/user.api';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ (cần 10 số)'),
    email: z.string().email('Email không hợp lệ').optional(),
    dateOfBirth: z
        .string()
        .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/u, 'Ngày sinh phải theo định dạng MM/DD/YYYY'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterStep = 'info' | 'otp';

export default function RegisterForm() {
    const router = useRouter();
    const [step, setStep] = useState<RegisterStep>('info');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verificationChannel, setVerificationChannel] = useState<'email' | 'sms'>('email');
    const [verificationIdentifier, setVerificationIdentifier] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const phoneFromQuery = params.get('phone');
            if (phoneFromQuery && phoneFromQuery.match(/^[0-9]{10}$/)) {
                setStep('otp');
                setVerificationChannel('sms');
                setVerificationIdentifier(phoneFromQuery);
            }
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            dateOfBirth: new Date().toISOString().slice(0, 10),
        },
    });


    const handleRegister = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            await registerCustomer({
                fullName: data.fullName,
                phoneNumber: data.phone,
                password: data.password,
                dateOfBirth: data.dateOfBirth,
            });

            toast.success('Đăng ký thành công! Vui lòng chọn hình thức xác thực.');
            setStep('otp');
            setOtpSent(false);
            setCountdown(0);
        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { desc?: string } } })?.response?.data?.desc ||
                'Không thể đăng ký. Vui lòng thử lại!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerification = async () => {
        if (!verificationIdentifier) {
            toast.error('Vui lòng nhập thông tin xác thực (email hoặc SMS).');
            return;
        }
        setLoading(true);
        try {
            await sendOtp(verificationChannel, verificationIdentifier);
            toast.success('Đã gửi mã xác thực. Vui lòng kiểm tra.');
            setOtpSent(true);
            setCountdown(60);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { desc?: string } } })?.response?.data?.desc ||
                'Không thể gửi mã xác thực. Vui lòng thử lại!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            toast.error('Vui lòng nhập đầy đủ mã OTP');
            return;
        }

        setLoading(true);
        try {
            toast.success('Xác thực thành công!');
            router.push('/login');
        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { desc?: string } } })?.response?.data?.desc ||
                'Mã OTP không đúng hoặc đã hết hạn!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setLoading(true);
        try {
            await sendOtp(verificationChannel, verificationIdentifier);

            toast.success('Mã OTP mới đã được gửi!');
            setCountdown(60);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            toast.error('Không thể gửi lại mã OTP. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout>
            <div className="min-h-screen bg-[#FFF5E6] flex">
                {/* Left side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative">
                    <Image
                        src="/images/Home - Banner.jpg"
                        alt="Tấm Tắc Food"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        {step === 'info' ? (
                            <>
                                <div className="text-center mb-6">
                                    <h1 className="text-4xl font-bold mb-3">
                                        <span className="text-[#FF6B35]">Tấm</span>{' '}
                                        <span className="text-gray-800">ngon, </span>
                                        <span className="text-[#8BC34A]">Tắc</span>{' '}
                                        <span className="text-gray-800">nhớ!</span>
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        Thương hiệu cơm tấm hàng đầu dành cho sinh viên.
                                    </p>
                                </div>

                                <form
                                    className="space-y-4"
                                    onSubmit={handleSubmit(handleRegister)}
                                >
                                    <div>
                                        <Input
                                            {...register('fullName')}
                                            placeholder="Họ và tên"
                                            className={`rounded-lg border ${errors.fullName
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } focus:border-[#FF6B35] focus:ring-[#FF6B35]`}
                                        />
                                        {errors.fullName && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.fullName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                {...register('phone')}
                                                type="tel"
                                                placeholder="Số điện thoại"
                                                className={`rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                    } focus:border-[#FF6B35] focus:ring-[#FF6B35]`}
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.phone.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Input
                                                {...register('dateOfBirth')}
                                                type="date"
                                                placeholder="Ngày sinh"
                                                max={new Date().toISOString().slice(0, 10)}
                                                lang="vi"
                                                className={` rounded-lg border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                                    } focus:border-[#FF6B35] focus:ring-[#FF6B35] text-center text-gray-500`}
                                            />
                                            {errors.dateOfBirth && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.dateOfBirth.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Input
                                            {...register('email')}
                                            type="email"
                                            placeholder="Email"
                                            className={`rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                } focus:border-[#FF6B35] focus:ring-[#FF6B35]`}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>



                                    <div>
                                        <div className="relative">
                                            <Input
                                                {...register('password')}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Mật khẩu"
                                                className={`rounded-lg border ${errors.password
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                    } focus:border-[#FF6B35] focus:ring-[#FF6B35]`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                            >
                                                <span className="text-sm text-gray-500">
                                                    {showPassword ? 'Ẩn' : 'Hiện'}
                                                </span>
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <Input
                                                {...register('confirmPassword')}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Xác nhận mật khẩu"
                                                className={`rounded-lg border ${errors.confirmPassword
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                    } focus:border-[#FF6B35] focus:ring-[#FF6B35]`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                            >
                                                <span className="text-sm text-gray-500">
                                                    {showConfirmPassword ? 'Ẩn' : 'Hiện'}
                                                </span>
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg py-3 font-semibold transition-colors"
                                        >
                                            {loading ? 'Đang xử lý...' : 'Gửi'}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="bg-[#FFF5E6] px-4 text-[#8BC34A] font-medium cursor-pointer hover:text-[#7CB342]">
                                                <Link href="/login">
                                                    Bạn là người nhà của Tấm Tắc?
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <p className="text-gray-600 text-sm mb-6">
                                        Chọn kênh xác thực và gửi mã OTP đến bạn.
                                    </p>

                                    <h1 className="text-4xl font-bold mb-6">
                                        <span className="text-[#FF6B35]">Tấm</span>{' '}
                                        <span className="text-gray-800">ngon, </span>
                                        <span className="text-[#8BC34A]">Tắc</span>{' '}
                                        <span className="text-gray-800">nhớ!</span>
                                    </h1>

                                    <div className="mb-4 text-left">
                                        <Label className="mb-2 inline-block">Chọn kênh xác thực</Label>
                                        <div className="flex gap-4 items-center">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="channel"
                                                    value="email"
                                                    checked={verificationChannel === 'email'}
                                                    onChange={() => setVerificationChannel('email')}
                                                />
                                                Email
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="channel"
                                                    value="sms"
                                                    checked={verificationChannel === 'sms'}
                                                    onChange={() => setVerificationChannel('sms')}
                                                />
                                                Zalo
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-6 text-left">
                                        <Input
                                            value={verificationIdentifier}
                                            onChange={(e) => setVerificationIdentifier(e.target.value)}
                                            placeholder={verificationChannel === 'email' ? 'Nhập email' : 'Nhập số điện thoại'}
                                            className="rounded-lg border border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <Button
                                            type="button"
                                            onClick={handleSendVerification}
                                            disabled={loading}
                                            className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white rounded-lg py-3 font-semibold transition-colors"
                                        >
                                            Gửi mã xác thực
                                        </Button>
                                    </div>

                                    <div className="flex justify-center mb-6">
                                        <InputOTP
                                            maxLength={6}
                                            value={otp}
                                            onChange={(value) => setOtp(value)}
                                        >
                                            <InputOTPGroup className="gap-2">
                                                <InputOTPSlot
                                                    index={0}
                                                    className="w-12 h-14 text-xl border-2 border-gray-300 rounded-lg focus:border-[#FF6B35]"
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className="w-12 h-14 text-xl border-2 border-gray-300 rounded-lg focus:border-[#FF6B35]"
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className="w-12 h-14 text-xl border-2 border-gray-300 rounded-lg focus:border-[#FF6B35]"
                                                />
                                                <InputOTPSlot
                                                    index={3}
                                                    className="w-12 h-14 text-xl border-2 border-gray-300 rounded-lg focus:border-[#FF6B35]"
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className="w-12 h-14 text-xl border-2 border-gray-300 rounded-lg focus:border-[#FF6B35]"
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className="w-12 h-14 text-xl border-2 border-gray-300 rounded-lg focus:border-[#FF6B35]"
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    {countdown > 0 ? (
                                        <p className="text-gray-500 text-sm mb-6">
                                            Gửi lại mã sau {countdown}s
                                        </p>
                                    ) : (
                                        <button
                                            onClick={handleResendOtp}
                                            disabled={loading}
                                            className="text-[#8BC34A] text-sm font-medium hover:text-[#7CB342] mb-6 underline"
                                        >
                                            Gửi lại mã OTP
                                        </button>
                                    )}

                                    <Button
                                        onClick={handleVerifyOtp}
                                        disabled={loading || otp.length !== 6}
                                        className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg py-3 font-semibold transition-colors"
                                    >
                                        {loading ? 'Đang xác thực...' : 'Đăng ký'}
                                    </Button>
                                </div>

                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="bg-[#FFF5E6] px-4 text-[#8BC34A] font-medium cursor-pointer hover:text-[#7CB342]">
                                                <Link href="/login">
                                                    Bạn là người nhà của Tấm Tắc?
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
