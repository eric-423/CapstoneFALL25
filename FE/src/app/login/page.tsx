import { Metadata } from 'next';
import LoginForm from './components/LoginForm';

export const metadata: Metadata = {
    title: 'Đăng nhập',
    description: 'Đăng nhập vào tài khoản Tấm Tắc để đặt món và trải nghiệm dịch vụ',
    robots: 'noindex, nofollow',
};

export default function LoginPage() {
    return <LoginForm />;
}