import { Metadata } from 'next';
import ForgotPasswordForm from './components/ForgotPasswordForm';

export const metadata: Metadata = {
    title: 'Quên mật khẩu',
    description: 'Khôi phục mật khẩu tài khoản Tấm Tắc',
    robots: 'noindex, nofollow',
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}

