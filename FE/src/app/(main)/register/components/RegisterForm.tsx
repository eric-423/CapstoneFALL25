'use client';

import { GuestLayout } from '@/components/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerCustomer, sendOtp, verifyOTP, getTimeResendOtp, loginCustomerViaApiRoute } from '@/apis/user.api';
import { setAuthToken } from '@/utils/cookies.client';
import { useAuthContext } from '@/utils/contexts/AuthContext';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ (cần 10 số)'),
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
    const { redirectAfterLogin } = useAuthContext();
    const [step, setStep] = useState<RegisterStep>('info');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [countdown, setCountdown] = useState(0);
    const [verificationIdentifier, setVerificationIdentifier] = useState('');

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    const [phoneForVerify, setPhoneForVerify] = useState<string | null>(null);
    const [passwordForAutoLogin, setPasswordForAutoLogin] = useState<string | null>(null);
    const [otpFeedback, setOtpFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);




    const clearPendingLoginState = useCallback(() => {
        if (typeof window === 'undefined') return;
        sessionStorage.removeItem('pendingLoginPhone');
        sessionStorage.removeItem('pendingLoginPassword');
    }, []);

    useEffect(() => {

        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const phoneFromQuery = params.get('phone');

            const pendingLoginPhone = sessionStorage.getItem('pendingLoginPhone');
            const pendingLoginPassword = sessionStorage.getItem('pendingLoginPassword');

            if (phoneFromQuery && phoneFromQuery.match(/^[0-9]{10}$/)) {
                setStep('otp');
                setVerificationIdentifier(phoneFromQuery);
                setPhoneForVerify(phoneFromQuery);
            } else if (pendingLoginPhone && pendingLoginPhone.match(/^[0-9]{10}$/)) {
                setStep('otp');
                setVerificationIdentifier(pendingLoginPhone);
                setPhoneForVerify(pendingLoginPhone);
            }

            if (pendingLoginPassword) {
                setPasswordForAutoLogin(pendingLoginPassword);
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
        setRegisterError(null);
        try {
            await registerCustomer({
                fullName: data.fullName,
                phoneNumber: data.phone,
                password: data.password,
                dateOfBirth: data.dateOfBirth,
            });

            setStep('otp');
            setCountdown(0);
            setPhoneForVerify(data.phone);
            setPasswordForAutoLogin(data.password);





        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { desc?: string } } })?.response?.data?.desc ||
                'Không thể đăng ký. Vui lòng thử lại!';
            setRegisterError(errorMessage);
        } finally {
            setLoading(false);

            // send otp với sdt đã đk
            try {
                const response = await sendOtp('zalo', data.phone);

                // Kiểm tra response có includes một đoạn nào đó
                const responseString = JSON.stringify(response).toLowerCase();
                if (responseString.includes('success') ||
                    responseString.includes('gửi') ||
                    responseString.includes('sent') ||
                    response?.message ||
                    response?.data) {
                    // Bắt đầu countdown 45 giây
                    setCountdown(45);
                } else {
                    // Nếu không có response phù hợp, thử lấy từ getTimeResendOtp
                    try {
                        const timeResendOtpResponse = await getTimeResendOtp('zalo', data.phone);
                        setCountdown(timeResendOtpResponse.data.ttl || 45);
                    } catch {
                        setCountdown(45);
                    }
                }
            } catch (error) {
                console.error('Failed to send OTP:', error);
                // Vẫn set countdown để người dùng có thể thử lại sau
                setCountdown(45);
            }
        }
    };



    const handleVerifyOtp = async (value?: string) => {
        const inputOtp = value ?? otp;

        if (loading) {
            return;
        }

        const identifier = verificationIdentifier || phoneForVerify;

        if (!identifier) {
            setOtpFeedback({
                type: 'error',
                text: 'Không tìm thấy thông tin xác thực phù hợp',
            });
            return;
        }

        setOtpFeedback(null);
        setLoading(true);
        try {

            await verifyOTP('zalo', identifier, inputOtp);

            clearPendingLoginState();

            const autoLoginSuccess = await autoLoginAfterRegister(identifier);
            if (!autoLoginSuccess) {
                setOtpFeedback({
                    type: 'error',
                    text: 'Xác thực thành công, vui lòng đăng nhập lại.',
                });
                router.push('/login');
            }


        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { desc?: string } } })?.response?.data?.desc ||
                'Mã OTP không đúng hoặc đã hết hạn!';
            setOtpFeedback({
                type: 'error',
                text: errorMessage,
            });
            setOtp('');

        } finally {
            setLoading(false);
        }
    };

    const autoLoginAfterRegister = async (phoneNumber: string) => {
        if (!passwordForAutoLogin) {
            return false;
        }

        try {
            const response = await loginCustomerViaApiRoute({
                phoneNumber,
                password: passwordForAutoLogin,
            });

            if (response.status === 200 && response.data?.token) {
                setAuthToken(response.data.token);
                const role = response.data.userInfo?.role || 'CUSTOMER';
                redirectAfterLogin(role);
                return true;
            }
        } catch (error) {
            console.error('Auto login after register failed:', error);
        }

        return false;
    };

    const handleResendOtp = async () => {
        if (!phoneForVerify) return;

        setOtpFeedback(null);
        try {
            const response = await sendOtp('zalo', phoneForVerify);

            const responseString = JSON.stringify(response).toLowerCase();
            if (responseString.includes('success') ||
                response?.desc) {
                setCountdown(45);
                setOtpFeedback({
                    type: 'success',
                    text: response?.desc,
                });
            }
        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { desc?: string } } })?.response?.data?.desc ||
                'Không thể gửi lại mã OTP. Vui lòng thử lại!';
            setOtpFeedback({
                type: 'error',
                text: errorMessage,
            });
        }
    };

    return (
        <GuestLayout>
            <div className="min-h-screen bg-[#FFF5E6] flex">
                <div className="hidden lg:flex lg:w-1/2 relative">

                    <Image
                        src="/images/Home - Banner.jpg"
                        alt="Tấm Tắc Food"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

                                {registerError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600 text-center">
                                            {registerError}
                                        </p>
                                    </div>
                                )}

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
                                        <div className="relative">
                                            <Input
                                                {...register('password', {
                                                    setValueAs: (value) => value?.trim() ?? '',
                                                })}
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
                                                {...register('confirmPassword', {
                                                    setValueAs: (value) => value?.trim() ?? '',
                                                })}
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
                                    <h1 className="text-4xl font-bold mb-6">
                                        <span className="text-[#FF6B35]">Tấm</span>{' '}
                                        <span className="text-gray-800">ngon, </span>
                                        <span className="text-[#8BC34A]">Tắc</span>{' '}
                                        <span className="text-gray-800">nhớ!</span>
                                    </h1>
                                    <p className="text-gray-600 text-sm max-w-sm mx-auto mb-4">
                                        Mã xác thực đang được gửi qua Zalo. Bạn vui lòng kiểm tra thông báo trong Zalo để lấy mã và nhập bên dưới nhé.
                                    </p>
                                    {otpFeedback && (
                                        <p
                                            className={`text-sm font-medium ${otpFeedback.type === 'error' ? 'text-red-600' : 'text-green-600'
                                                } mb-4`}
                                        >
                                            {otpFeedback.text}
                                        </p>
                                    )}

                                    <div className="flex justify-center mb-6">
                                        <InputOTP
                                            maxLength={6}
                                            value={otp}
                                            onChange={(value) => setOtp(value)}
                                            onComplete={(value) => handleVerifyOtp(value)}
                                            disabled={loading}
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
                                            className="text-[#8BC34A] text-sm font-medium hover:text-[#7CB342] mb-6 underline cursor-pointer"
                                        >
                                            Gửi lại mã OTP
                                        </button>
                                    )
                                    }
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
