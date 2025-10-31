'use client';

import { GuestLayout } from '@/components/layouts/GuestLayout';
import { loginCustomer } from '@/apis/user.api';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/utils/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function LoginForm() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
    const { redirectAfterLogin } = useAuthContext();

    useEffect(() => {
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

        if (!validatePhone(phone)) {
            setErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ (cần 10 số)' }));
            return;
        }

        setLoading(true);

        try {
            const response = await loginCustomer({ phoneNumber: phone, password });
            if (response.status === 200) {


                if (rememberMe) {

                    localStorage.setItem('rememberedPhone', phone);
                    localStorage.setItem('rememberMe', 'true');
                } else {

                    localStorage.removeItem('rememberedPhone');
                    localStorage.setItem('rememberMe', 'false');
                }

                toast.success('Đăng nhập thành công!');

                const token = response.data.token;

                localStorage.setItem('tok', token);

                const decoded = JSON.parse(atob(token.split('.')[1]));


                redirectAfterLogin(decoded.role);
            }


        } catch (error: unknown) {

            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;

            if (errorMessage?.toLowerCase().includes('phone number') || errorMessage?.toLowerCase().includes('số điện thoại')) {
                setErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ (cần 10 số)' }));
            } else if (errorMessage?.toLowerCase().includes('password') || errorMessage?.toLowerCase().includes('mật khẩu')) {
                setErrors(prev => ({ ...prev, password: 'Mật khẩu không hợp lệ' }));
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
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
                        className="object-cover"
                        priority
                    />

                </div>




                <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">

                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-4">
                                <span className="text-[#FF6B35]">Tấm</span>{' '}
                                <span className="text-gray-800">ngon, </span>
                                <span className="text-[#8BC34A]">Tắc</span>{' '}
                                <span className="text-gray-800">nhớ!</span>
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Thương hiệu cơm tấm hàng đầu dành cho sinh viên.
                            </p>


                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Số điện thoại"
                                    className={`rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-[#FF6B35] focus:ring-[#FF6B35]`}
                                />

                                {errors.phone && (

                                    <>
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                        {errors.phone === 'Số điện thoại chưa được xác thực. Vui lòng xác thực số điện thoại trước khi đăng nhập.' && (
                                            <button
                                                type="button"
                                                className="mt-2 text-[#FF6B35] underline text-sm ml-2"
                                                onClick={() => {
                                                    window.location.href = `/register?phone=${encodeURIComponent(phone)}`;
                                                }}
                                            >
                                                Gửi lại mã xác thực
                                            </button>
                                        )}
                                    </>

                                )}
                            </div>



                            <div>


                                <div className="relative">

                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mật khẩu"
                                        className={`rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-[#FF6B35] focus:ring-[#FF6B35] pr-10`}
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
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}


                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-lg bg-[#FF6B35] py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#FF5722] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:opacity-50 transition-colors"
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
                                    <Link
                                        href="/register"
                                        className="bg-[#FFF5E6] px-4 text-[#8BC34A] font-medium hover:text-[#7CB342] transition-colors"
                                    >
                                        Bạn chưa là người nhà của Tấm Tắc?
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
