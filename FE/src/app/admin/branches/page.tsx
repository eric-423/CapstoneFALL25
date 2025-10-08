'use client';

import { AdminGuard } from '@/components/guards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MOCK_BRANCHES } from '@/mocks/data/branches.mock';
import { Store, Plus, MapPin, Phone, User, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function BranchesPage() {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#f9fafb] py-8">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight flex items-center gap-3">
                                <Store className="text-primary" size={36} />
                                Quản Lý Chi Nhánh
                            </h1>
                            <p className="text-gray-600 text-lg">Quản lý thông tin các chi nhánh cửa hàng</p>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 rounded-xl font-semibold hover:scale-105">
                            <Plus size={22} className="mr-2" strokeWidth={2.5} />
                            Thêm Chi Nhánh
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Tổng chi nhánh</p>
                                    <p className="text-4xl font-bold text-gray-900 group-hover:text-primary transition-colors">{MOCK_BRANCHES.length}</p>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <Store size={32} className="text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Đang hoạt động</p>
                                    <p className="text-4xl font-bold text-green-600">
                                        {MOCK_BRANCHES.filter(b => b.status === 'ACTIVE').length}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <CheckCircle size={32} className="text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>
                        <Card className="relative overflow-hidden p-6 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Tạm ngưng</p>
                                    <p className="text-4xl font-bold text-red-600">
                                        {MOCK_BRANCHES.filter(b => b.status !== 'ACTIVE').length}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <XCircle size={32} className="text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Branches Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
                                                <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold shadow-sm ${branch.status === 'ACTIVE'
                                                    ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                                    : 'bg-red-50 text-red-700 border-2 border-red-200'
                                                    }`}>
                                                    {branch.status === 'ACTIVE' ? <CheckCircle size={14} strokeWidth={2.5} /> : <XCircle size={14} strokeWidth={2.5} />}
                                                    {branch.status}
                                                </span>
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
                </div>
            </div>
        </AdminGuard>
    );
}
