import { Metadata } from 'next';
import InsideLoginForm from './components/InsideLoginForm';

export const metadata: Metadata = {
    title: 'Đăng nhập nội bộ',
    description: 'Công đăng nhập dành cho Admin, Quản lý và nhân viên hậu cần. Đảm bảo thông tin vận hành luôn chính xác và đồng bộ.',
    robots: 'noindex, nofollow',
};

export default function InsideLoginPage() {
    return <InsideLoginForm />;
}
