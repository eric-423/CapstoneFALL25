'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Store, MapPin, Phone, User, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { AddBranchDialog } from './components/AddBranchDialog';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';

// Temporary empty array until API is implemented
const MOCK_BRANCHES: any[] = [];

export default function BranchesPage() {
    return (
        <AdminGuard>
            <AdminPageLayout>
                {/* Header */}
                <AdminPageHeader
                    title="Quản Lý Chi Nhánh"
                    icon={Store}
                    actions={<AddBranchDialog />}
                />

                {/* Stats */}
                <AdminStatsGrid>
                    <AdminStatsCard
                        title="Tổng chi nhánh"
                        value={MOCK_BRANCHES.length}
                        icon={Store}
                    />
                    <AdminStatsCard
                        title="Đang hoạt động"
                        value={MOCK_BRANCHES.filter(b => b.isActive === true).length}
                        icon={CheckCircle}
                        className="border-green-200"
                        iconClassName="from-green-400 to-green-600"
                    />
                    <AdminStatsCard
                        title="Tạm ngưng"
                        value={MOCK_BRANCHES.filter(b => b.isActive === false).length}
                        icon={XCircle}
                        className="border-red-200"
                        iconClassName="from-red-400 to-red-600"
                    />
                    <AdminStatsCard
                        title="Chi nhánh chính"
                        value={MOCK_BRANCHES.filter(b => b.isParent === true).length}
                        icon={Store}
                        className="border-blue-200"
                        iconClassName="from-blue-400 to-blue-600"
                    />
                </AdminStatsGrid>

                {/* Branches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MOCK_BRANCHES.map(branch => (
                            <Card key={branch.id} className="relative overflow-hidden p-8 bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-500 group rounded-2xl">
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                <Store size={30} className="text-white" strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                    {branch.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold shadow-sm ${branch.isActive
                                                        ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                                        : 'bg-red-50 text-red-700 border-2 border-red-200'
                                                        }`}>
                                                        {branch.isActive ? <CheckCircle size={14} strokeWidth={2.5} /> : <XCircle size={14} strokeWidth={2.5} />}
                                                        {branch.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                                    </span>
                                                    {branch.isParent && (
                                                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 border-2 border-blue-200 rounded-full font-bold shadow-sm">
                                                            Chi nhánh chính
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <MapPin size={20} className="text-primary" strokeWidth={2.5} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed">{branch.address}</p>
                                        </div>
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                                            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Phone size={20} className="text-secondary" strokeWidth={2.5} />
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">{branch.phone}</p>
                                        </div>
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <User size={20} className="text-purple-600" strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Quản lý</p>
                                                <p className="text-sm font-bold text-gray-900">{branch.managerId || 'Chưa phân công'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-6 border-t-2 border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all duration-300 py-6"
                                        >
                                            <Edit size={18} className="mr-2" strokeWidth={2.5} />
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all duration-300 py-6"
                                        >
                                            <Trash2 size={18} className="mr-2" strokeWidth={2.5} />
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                </div>
            </AdminPageLayout>
        </AdminGuard>
    );
}
