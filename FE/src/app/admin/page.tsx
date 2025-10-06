import { Metadata } from 'next';
import AdminDashboardContent from './components/AdminDashboardContent';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Trang quản trị dành cho Admin',
    robots: 'noindex, nofollow',
};

export default function AdminDashboard() {
    return <AdminDashboardContent />;
}