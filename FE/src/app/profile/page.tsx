import { Metadata } from 'next';
import ProfileContent from './components/ProfileContent';

export const metadata: Metadata = {
    title: 'Hồ sơ cá nhân',
    description: 'Quản lý thông tin cá nhân và cài đặt tài khoản',
    robots: 'noindex, nofollow',
};

export default function ProfilePage() {
    return <ProfileContent />;
}