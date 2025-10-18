import { Metadata } from 'next';
import RegisterForm from '@/app/(main)/register/components/RegisterForm';

export const metadata: Metadata = {
    title: 'Đăng ký',
    description: 'Đăng ký tài khoản Tấm Tắc để trải nghiệm dịch vụ',
    robots: 'noindex, nofollow',
};

export default function RegisterPage() {
    return <RegisterForm />;
}
