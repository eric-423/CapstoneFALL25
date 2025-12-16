'use client';

import { GuestLayout } from '@/components/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    forgotPassword,
    verifyOtpForgotPassword,
    resetPassword,
    getTimeResendOtp,
} from '@/apis/user.api';

const phoneSchema = z.object({
    phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ (cần 10 số)'),
});

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    });

type PhoneFormData = z.infer<typeof phoneSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type ForgotPasswordStep = 'phone' | 'otp' | 'reset';

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { desc?: string; error?: string; message?: string } } }).response;
        if (response?.data) {
            return response.data.desc || response.data.error || response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
        }
    }
    return 'Đã xảy ra lỗi. Vui lòng thử lại.';
};

export default function ForgotPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<ForgotPasswordStep>('phone');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otp, setOtp] = useState('');
    const [verifiedOtp, setVerifiedOtp] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [otpFeedback, setOtpFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const hasProcessedPhoneFromQuery = useRef(false);

    const {
        register: registerPhone,
        handleSubmit: handleSubmitPhone,
        formState: { errors: phoneErrors },
        setValue: setPhoneValue,
        setError: setPhoneError,
    } = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && !hasProcessedPhoneFromQuery.current) {
            const phoneFromQuery = searchParams?.get('phone');
            if (phoneFromQuery && phoneFromQuery.match(/^[0-9]{10}$/)) {
                hasProcessedPhoneFromQuery.current = true;
                setPhoneNumber(phoneFromQuery);
                setPhoneValue('phone', phoneFromQuery);
                const triggerForgotPassword = async () => {
                    setLoading(true);
                    setOtpFeedback(null);

                    try {
                        await forgotPassword(phoneFromQuery);
                        setStep('otp');
                        setCountdown(0);

                        try {
                            const timeResendResponse = await getTimeResendOtp('zalo', phoneFromQuery);
                            setCountdown(timeResendResponse.data.ttl || 0);
                        } catch (error) {
                            console.error('Failed to get resend time:', error);
                        }

                    } catch (error: unknown) {
                        const errorMessage = getErrorMessage(error) || 'Không thể gửi mã OTP. Vui lòng thử lại.';

                        const lowerErrorMessage = errorMessage.toLowerCase();
                        if (lowerErrorMessage.includes('đợi') || lowerErrorMessage.includes('vừa yêu cầu') || lowerErrorMessage.includes('gần đây')) {
                            setPhoneError('phone', {
                                type: 'manual',
                                message: errorMessage,
                            });
                        }
                    } finally {
                        setLoading(false);
                    }
                };

                triggerForgotPassword();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleForgotPassword = async (phone?: string) => {
        const phoneToUse = phone || phoneNumber;
        if (!phoneToUse || !phoneToUse.match(/^[0-9]{10}$/)) {
            toast.error('Vui lòng nhập số điện thoại hợp lệ');
            return;
        }

        setLoading(true);
        setOtpFeedback(null);

        try {
            await forgotPassword(phoneToUse);
            setPhoneNumber(phoneToUse);
            setStep('otp');
            setCountdown(0);

            try {
                const timeResendResponse = await getTimeResendOtp('zalo', phoneToUse);
                setCountdown(timeResendResponse.data.ttl || 0);
            } catch (error) {
                console.error('Failed to get resend time:', error);
            }

        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error) || 'Không thể gửi mã OTP. Vui lòng thử lại.';

            const lowerErrorMessage = errorMessage.toLowerCase();
            if (lowerErrorMessage.includes('đợi') || lowerErrorMessage.includes('vừa yêu cầu') || lowerErrorMessage.includes('gần đây')) {
                setPhoneError('phone', {
                    type: 'manual',
                    message: errorMessage,
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (value?: string) => {
        const inputOtp = value ?? otp;

        if (loading) {
            return;
        }

        if (!phoneNumber) {
            toast.error('Không tìm thấy số điện thoại');
            return;
        }

        setOtpFeedback(null);
        setLoading(true);

        try {
            const response = await verifyOtpForgotPassword({
                channel: 'zalo',
                identifier: phoneNumber,
                inputOtp: inputOtp,
            });

            if (response.status === 200) {
                setVerifiedOtp(inputOtp);
                setStep('reset');
                setOtpFeedback({
                    type: 'success',
                    text: 'Xác thực thành công. Vui lòng nhập mật khẩu mới.',
                });
            }
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error) || 'Mã OTP không đúng hoặc đã hết hạn!';
            setOtpFeedback({
                type: 'error',
                text: errorMessage,
            });
            setOtp('');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!phoneNumber) {
            toast.error('Vui lòng nhập số điện thoại');
            return;
        }

        setOtpFeedback(null);
        setLoading(true);

        try {
            await forgotPassword(phoneNumber);
            setOtp('');

            try {
                const timeResendResponse = await getTimeResendOtp('zalo', phoneNumber);
                setCountdown(timeResendResponse.data.ttl || 60);
            } catch {
                setCountdown(60);
            }

        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error) || 'Không thể gửi lại mã OTP. Vui lòng thử lại.';
            setOtpFeedback({
                type: 'error',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (data: ResetPasswordFormData) => {
        if (!phoneNumber || !verifiedOtp) {

            return;
        }

        setLoading(true);

        try {
            await resetPassword({
                otp: verifiedOtp,
                phoneNumber: phoneNumber,
                newPassword: data.password,
            });

            router.push('/login');
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error) || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onPhoneSubmit = (data: PhoneFormData) => {
        handleForgotPassword(data.phone);
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
                        {step === 'phone' && (
                            <>
                                <div className="text-center mb-6">
                                    <h1 className="text-4xl font-bold mb-3">
                                        <span className="text-[#FF6B35]">Quên</span>{' '}
                                        <span className="text-gray-800">mật khẩu?</span>
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        Nhập số điện thoại để nhận mã OTP khôi phục mật khẩu
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={handleSubmitPhone(onPhoneSubmit)}>
                                    <div>
                                        <Input
                                            {...registerPhone('phone')}
                                            type="tel"
                                            placeholder="Số điện thoại"
                                            className={`rounded-lg border ${phoneErrors.phone ? 'border-red-500' : 'border-gray-300'
                                                } focus:border-[#FF6B35] focus:ring-[#FF6B35]`}
                                        />
                                        {phoneErrors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{phoneErrors.phone.message}</p>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg py-3 font-semibold transition-colors"
                                        >
                                            {loading ? 'Đang xử lý...' : 'Gửi mã OTP'}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="bg-[#FFF5E6] px-4 text-gray-600">
                                                <Link href="/login" className="text-[#FF6B35] font-medium hover:underline">
                                                    Quay lại đăng nhập
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 'otp' && (
                            <>
                                <div className="text-center mb-6">
                                    <h1 className="text-4xl font-bold mb-6">
                                        <span className="text-[#FF6B35]">Nhập</span>{' '}
                                        <span className="text-gray-800">mã OTP</span>
                                    </h1>
                                    <p className="text-gray-600 text-sm max-w-sm mx-auto mb-4">
                                        Mã xác thực đang được gửi qua Zalo đến số{' '}
                                        <span className="font-semibold">{phoneNumber}</span>. Bạn vui lòng kiểm tra
                                        thông báo trong Zalo để lấy mã và nhập bên dưới nhé.
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
                                        <p className="text-gray-500 text-sm mb-6 text-center">
                                            Gửi lại mã sau {countdown}s
                                        </p>
                                    ) : (
                                        <div className="text-center mb-6">
                                            <button
                                                onClick={handleResendOtp}
                                                disabled={loading}
                                                className="text-[#8BC34A] text-sm font-medium hover:text-[#7CB342] underline disabled:opacity-50"
                                            >
                                                Gửi lại mã OTP
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <button
                                            onClick={() => {
                                                setStep('phone');
                                                setOtp('');
                                                setOtpFeedback(null);
                                            }}
                                            className="text-sm text-gray-600 hover:text-[#FF6B35]"
                                        >
                                            Thay đổi số điện thoại
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 'reset' && (
                            <>
                                <div className="text-center mb-6">
                                    <h1 className="text-4xl font-bold mb-3">
                                        <span className="text-[#FF6B35]">Đặt lại</span>{' '}
                                        <span className="text-gray-800">mật khẩu</span>
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        Nhập mật khẩu mới cho số điện thoại{' '}
                                        <span className="font-semibold">{phoneNumber}</span>
                                    </p>
                                    {otpFeedback && otpFeedback.type === 'success' && (
                                        <p className="text-sm font-medium text-green-600 mt-2">{otpFeedback.text}</p>
                                    )}
                                </div>

                                <form className="space-y-4" onSubmit={handleSubmitPassword(handleResetPassword)}>
                                    <div>
                                        <div className="relative">
                                            <Input
                                                {...registerPassword('password', {
                                                    setValueAs: (value) => value?.trim() ?? '',
                                                })}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Mật khẩu mới"
                                                className={`rounded-lg border ${passwordErrors.password ? 'border-red-500' : 'border-gray-300'
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
                                        {passwordErrors.password && (
                                            <p className="mt-1 text-sm text-red-600">{passwordErrors.password.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <Input
                                                {...registerPassword('confirmPassword', {
                                                    setValueAs: (value) => value?.trim() ?? '',
                                                })}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Xác nhận mật khẩu mới"
                                                className={`rounded-lg border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                    } focus:border-[#FF6B35] focus:ring-[#FF6B35]`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                            >
                                                <span className="text-sm text-gray-500">
                                                    {showConfirmPassword ? 'Ẩn' : 'Hiện'}
                                                </span>
                                            </button>
                                        </div>
                                        {passwordErrors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {passwordErrors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg py-3 font-semibold transition-colors"
                                        >
                                            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

