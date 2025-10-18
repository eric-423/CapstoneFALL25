'use client';

import { GuestLayout } from '@/components/layouts/GuestLayout';
import { signInStaff } from '@/apis/user.api';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function InsideLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const { redirectAfterLogin } = useAuthContext();

    useEffect(() => {
        const savedEmail = localStorage.getItem('insideRememberedEmail');
        const savedRememberMe = localStorage.getItem('insideRememberMe') === 'true';

        if (savedEmail && savedRememberMe) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

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
            // Send email as phoneNumber field for staff login API
            const response = await signInStaff({ phoneNumber: email, password });
            if (response.status === 200) {
                if (rememberMe) {
                    localStorage.setItem('insideRememberedEmail', email);
                    localStorage.setItem('insideRememberMe', 'true');
                } else {
                    localStorage.removeItem('insideRememberedEmail');
                    localStorage.setItem('insideRememberMe', 'false');
                }

                toast.success('Đăng nhập nội bộ thành công!');
                const token = response.data.data.access_token;
                const decoded = JSON.parse(atob(token.split('.')[1]));
                redirectAfterLogin(decoded.role);
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { desc?: string } } })?.response?.data?.desc || 'Email hoặc mật khẩu không đúng';

            if (errorMessage.toLowerCase().includes('email')) {
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

    return (
        <GuestLayout>
            <div className="min-h-screen bg-slate-50 flex">
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <Image
                        src="/images/Home - Banner.jpg"
                        alt="Tâm Tắc nội bộ"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
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
                            <h1 className="text-3xl font-semibold text-slate-900">Đăng nhập nội bộ</h1>
                            <p className="mt-3 text-sm text-slate-600">
                                Truy cập hệ thống quản trị Tâm Tắc dành cho nhân sự được ủy quyền.
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'
                                        } px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:text-sm`}
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
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`block w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-300'
                                            } px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:text-sm`}
                                        placeholder="Nhập mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm text-slate-500 hover:text-slate-700"
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
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                    />
                                    Ghi nhớ đăng nhập
                                </label>
                                <Link href="mailto:it@tam-tac.com" className="text-slate-900 font-medium hover:underline">
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-lg bg-slate-900 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-600">
                            <p>
                                Dành cho khách hàng?{' '}
                                <Link href="/login" className="text-slate-900 font-medium hover:underline">
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
