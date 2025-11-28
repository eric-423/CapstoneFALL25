'use client';

import { GuestLayout } from '@/components/layouts/GuestLayout';
import { Input } from '@/components/ui/input';
import { loginEmployeeViaApiRoute, sendOtp, verifyOTP } from '@/apis/user.api';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type LoginStep = 'login' | 'otp';

export default function InsideLoginForm() {
    const [step, setStep] = useState<LoginStep>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [countdown, setCountdown] = useState(0);
    const [otpFeedback, setOtpFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const { redirectAfterLogin } = useAuthContext();

    useEffect(() => {
        const savedEmail = localStorage.getItem('insideRememberedEmail');
        const savedRememberMe = localStorage.getItem('insideRememberMe') === 'true';

        if (savedEmail && savedRememberMe) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validateEmail(email)) {
            setErrors(prev => ({ ...prev, email: 'Email không hợp lệ' }));
            return;
        }

        setLoading(true);

        try {
            const response = await loginEmployeeViaApiRoute({ email, password });
            if (response.status === 200 && response.data?.token) {

                if (rememberMe) {
                    localStorage.setItem('insideRememberedEmail', email);
                    localStorage.setItem('insideRememberMe', 'true');
                } else {
                    localStorage.removeItem('insideRememberedEmail');
                    localStorage.setItem('insideRememberMe', 'false');
                }

                // localStorage.setItem('token', response.data.token);

                const role = response.data.userInfo?.role;

                redirectAfterLogin(role);

            }

        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message
                || (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error
                || 'Email hoặc mật khẩu không đúng';

            // Check if email is not verified
            if (errorMessage.toLowerCase().includes('chưa được xác thực') ||
                errorMessage.toLowerCase().includes('chưa xác thực') ||
                errorMessage.toLowerCase().includes('email not verified') ||
                errorMessage.toLowerCase().includes('email chưa verify')) {
                // Switch to OTP step and send OTP
                setStep('otp');
                setErrors(prev => ({ ...prev, email: 'Email chưa được xác thực. Vui lòng xác thực email trước khi đăng nhập.' }));
                setLoading(false); // Reset loading before sending OTP
                // Send OTP after state updates
                setTimeout(() => {
                    handleSendOtp();
                }, 100);
            } else if (errorMessage.toLowerCase().includes('email')) {
                setErrors(prev => ({ ...prev, email: errorMessage }));
            } else if (errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('mật khẩu')) {
                setErrors(prev => ({ ...prev, password: errorMessage }));
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!validateEmail(email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        setLoading(true);
        setOtpFeedback(null);
        try {
            await sendOtp('email', email);
            setCountdown(60);
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { desc?: string; message?: string } } })?.response?.data?.desc
                || (error as { response?: { data?: { desc?: string; message?: string } } })?.response?.data?.message
                || 'Không thể gửi OTP. Vui lòng thử lại.';
            setOtpFeedback({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (value?: string) => {
        const inputOtp = value ?? otp;

        if (!inputOtp || inputOtp.length !== 6) {
            setOtpFeedback({ type: 'error', text: 'Vui lòng nhập đủ 6 số OTP' });
            return;
        }

        if (!validateEmail(email)) {
            setOtpFeedback({ type: 'error', text: 'Email không hợp lệ' });
            return;
        }

        setOtpFeedback(null);
        setLoading(true);

        try {
            await verifyOTP('email', email, inputOtp);

            setOtpFeedback({ type: 'success', text: 'Xác thực email thành công. Đang đăng nhập...' });

            setTimeout(async () => {
                try {
                    const response = await loginEmployeeViaApiRoute({ email, password });
                    if (response.status === 200 && response.data?.token) {
                        if (rememberMe) {
                            localStorage.setItem('insideRememberedEmail', email);
                            localStorage.setItem('insideRememberMe', 'true');
                        } else {
                            localStorage.removeItem('insideRememberedEmail');
                            localStorage.setItem('insideRememberMe', 'false');
                        }

                        const role = response.data.userInfo?.role;
                        redirectAfterLogin(role);
                    }
                } catch (loginError: unknown) {
                    const loginErrorMessage = (loginError as { response?: { data?: { message?: string } } })?.response?.data?.message
                        || 'Đăng nhập thất bại. Vui lòng thử lại.';
                    setOtpFeedback({ type: 'error', text: loginErrorMessage });
                    setStep('login');
                } finally {
                    setLoading(false);
                }
            }, 1000);
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { desc?: string; message?: string } } })?.response?.data?.desc
                || (error as { response?: { data?: { desc?: string; message?: string } } })?.response?.data?.message
                || 'Mã OTP không đúng hoặc đã hết hạn!';
            setOtpFeedback({ type: 'error', text: errorMessage });
            setOtp('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout>
            <div className="min-h-screen bg-[#FFF5E6] flex">
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <Image
                        src="/images/Home - Banner.jpg"
                        alt="Tâm Tắc nội bộ"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                        <div>
                            <h2 className="text-4xl font-bold">Tâm Tắc Inside</h2>
                            <p className="mt-4 text-base leading-relaxed text-gray-100">
                                Cổng đăng nhập dành cho Admin, Quản lý và nhân viên hậu cần.
                                Đảm bảo thông tin vận hành luôn chính xác và đồng bộ.
                            </p>
                        </div>
                        <div className="space-y-4 text-sm text-gray-200">
                            <div>
                                <p className="font-semibold">Hỗ trợ 24/7</p>
                                <p>Liên hệ phòng IT nếu bạn cần cấp lại mật khẩu hoặc gặp sự cố truy cập.</p>
                            </div>
                            <div>
                                <p className="font-semibold">Quy chế bảo mật</p>
                                <p>Vui lòng không chia sẻ tài khoản nội bộ và đăng xuất sau khi sử dụng.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-semibold text-gray-900">
                                {step === 'login' ? (
                                    <>
                                        <span className="text-[#FF6B35]">Đăng nhập</span> nội bộ
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[#FF6B35]">Xác thực</span> email
                                    </>
                                )}
                            </h1>
                            <p className="mt-3 text-sm text-gray-600">
                                {step === 'login'
                                    ? 'Truy cập hệ thống quản trị Tâm Tắc dành cho nhân sự được ủy quyền.'
                                    : 'Mã xác thực đang được gửi qua email đến địa chỉ email của bạn. Vui lòng kiểm tra email để lấy mã và nhập bên dưới.'
                                }
                            </p>
                        </div>

                        {step === 'login' ? (
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 placeholder:text-slate-400`}
                                        placeholder="Nhập email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 pr-12 placeholder:text-slate-400`}
                                            placeholder="Nhập mật khẩu"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm text-gray-500 hover:text-[#FF6B35]"
                                        >
                                            {showPassword ? 'Ẩn' : 'Hiện'}
                                        </button>

                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="inline-flex items-center gap-2 text-slate-600">
                                        <Input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                        />
                                        Ghi nhớ đăng nhập
                                    </label>
                                    <Link href="mailto:it@tam-tac.com" className="text-[#FF6B35] font-medium hover:underline">
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-lg bg-[#FF6B35] py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#FF5722] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-5">
                                <div className="text-center mb-6">
                                    <p className="text-gray-600 text-sm mb-2">
                                        Mã xác thực đang được gửi qua email đến{' '}
                                        <span className="font-semibold">{email}</span>
                                    </p>
                                    {otpFeedback && (
                                        <p
                                            className={`text-sm font-medium ${otpFeedback.type === 'error' ? 'text-red-600' : 'text-green-600'
                                                } mb-4`}
                                        >
                                            {otpFeedback.text}
                                        </p>
                                    )}
                                </div>

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

                                <div className="text-center">
                                    {countdown > 0 ? (
                                        <p className="text-gray-500 text-sm mb-4">
                                            Gửi lại mã sau {countdown}s
                                        </p>
                                    ) : (
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            className="text-[#FF6B35] text-sm font-medium hover:text-[#FF5722] mb-4 underline disabled:opacity-50"
                                        >
                                            Gửi lại mã OTP
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleVerifyOtp()}
                                    disabled={loading || otp.length !== 6}
                                    className="flex w-full justify-center rounded-lg bg-[#FF6B35] py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#FF5722] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Đang xác thực...' : 'Xác thực'}
                                </button>

                                <button
                                    onClick={() => {
                                        setStep('login');
                                        setOtp('');
                                        setOtpFeedback(null);
                                        setCountdown(0);
                                    }}
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-lg border border-gray-300 py-3 px-4 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 disabled:opacity-50 transition-colors"
                                >
                                    Quay lại đăng nhập
                                </button>
                            </div>
                        )}

                        <div className="mt-8 text-center text-sm text-slate-600">
                            <p>
                                Dành cho khách hàng?{' '}
                                <Link href="/login" className="text-[#FF6B35] font-medium hover:underline">
                                    Chuyển đến cổng khách hàng
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
