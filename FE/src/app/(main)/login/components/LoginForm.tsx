'use client';

import { GuestLayout } from '@/components/layouts/GuestLayout';
import { signIn } from '@/apis/user.api';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function LoginForm() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
    const { redirectAfterLogin } = useAuthContext();

    useEffect(() => {
        // Load remembered credentials if available
        const savedPhone = localStorage.getItem('rememberedPhone');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

        if (savedPhone && savedRememberMe) {
            setPhone(savedPhone);
            setRememberMe(true);
        }
    }, []);

    const validatePhone = (phoneNumber: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validate phone
        if (!validatePhone(phone)) {
            setErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ (cần 10 số)' }));
            return;
        }

        setLoading(true);

        try {
            const response = await signIn({ phoneNumber: phone, password });
            if (response.status === 200) {
                // Handle remember me
                if (rememberMe) {
                    localStorage.setItem('rememberedPhone', phone);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberedPhone');
                    localStorage.setItem('rememberMe', 'false');
                }

                toast.success('Đăng nhập thành công!');
                const token = response.data.access_token;
                const decoded = JSON.parse(atob(token.split('.')[1]));
                redirectAfterLogin(decoded.role);
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { desc?: string } } })?.response?.data?.desc || 'Đăng nhập thất bại';

            // Set field-specific errors if available
            if (errorMessage.toLowerCase().includes('phone') || errorMessage.toLowerCase().includes('số điện thoại')) {
                setErrors(prev => ({ ...prev, phone: errorMessage }));
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
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-950">
                        Đăng nhập vào tài khoản
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                                    Số điện thoại
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={`block w-full appearance-none rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            } px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                        placeholder="Nhập số điện thoại"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    Mật khẩu
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`block w-full appearance-none rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            } px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                                        placeholder="Nhập mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <span className="text-sm text-gray-500">
                                            {showPassword ? 'Ẩn' : 'Hiện'}
                                        </span>
                                    </button>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-950">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                >
                                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-2 text-gray-500">Chưa có tài khoản?</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/register"
                                    className="flex w-full justify-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}