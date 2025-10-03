import { Metadata } from 'next';
import ManagerDashboardContent from './components/ManagerDashboardContent';

export const metadata: Metadata = {
    title: 'Manager Dashboard',
    description: 'Trang quản lý dành cho Manager',
    robots: 'noindex, nofollow',
};

export default function ManagerDashboard() {
    return <ManagerDashboardContent />;
}