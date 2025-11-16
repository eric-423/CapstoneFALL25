'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Building,
    Plus,
    Edit2,
    MapPin,
    Phone,
    Power,
    PowerOff,
    CheckCircle,
    XCircle,
    Search,
    Crown,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageLayout, AdminPageHeader, AdminStatsCard, AdminStatsGrid } from '../components/AdminPageLayout';
import { getBranchStatistics, activateBranch, deactivateBranch, type BranchStatistics, type BranchDetail } from '@/apis/branch.api';
import { BranchFormDialog } from './components/BranchFormDialog';
import { BranchConfirmDialog } from './components/BranchConfirmDialog';

export default function BranchesManagementPage() {
    const [statistics, setStatistics] = useState<BranchStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [actionLoading, setActionLoading] = useState(false);

    // Dialog states
    const [showDialog, setShowDialog] = useState(false);
    const [editingBranch, setEditingBranch] = useState<BranchDetail | null>(null);

    // Confirm dialog states
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmType, setConfirmType] = useState<'activate' | 'deactivate'>('activate');
    const [selectedBranch, setSelectedBranch] = useState<{ id: number; name: string } | null>(null);

    const fetchStatistics = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getBranchStatistics();
            setStatistics(data);
        } catch (error) {
            console.error('Failed to fetch branch statistics:', error);
            toast.error('❌ Không thể tải danh sách chi nhánh!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    const handleCreateBranch = () => {
        setEditingBranch(null);
        setShowDialog(true);
    };

    const handleEditBranch = (branch: BranchDetail) => {
        setEditingBranch(branch);
        setShowDialog(true);
    };

    const handleActivate = (branchId: number, branchName: string) => {
        setSelectedBranch({ id: branchId, name: branchName });
        setConfirmType('activate');
        setShowConfirmDialog(true);
    };

    const handleDeactivate = (branchId: number, branchName: string) => {
        setSelectedBranch({ id: branchId, name: branchName });
        setConfirmType('deactivate');
        setShowConfirmDialog(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedBranch) return;

        try {
            setActionLoading(true);

            if (confirmType === 'activate') {
                await activateBranch(selectedBranch.id);
                toast.success(`✅ Đã kích hoạt chi nhánh "${selectedBranch.name}"!`);
            } else {
                await deactivateBranch(selectedBranch.id);
                toast.success(`🔒 Đã vô hiệu hóa chi nhánh "${selectedBranch.name}"!`);
            }

            await fetchStatistics();
            setShowConfirmDialog(false);
            setSelectedBranch(null);
        } catch (error) {
            console.error('Failed to perform action:', error);
            toast.error(`❌ Không thể ${confirmType === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} chi nhánh!`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDialogSuccess = () => {
        fetchStatistics();
    };

    // Filter branches
    const filteredBranches = statistics?.branches.filter(branch => {
        const matchesKeyword = !searchKeyword ||
            branch.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            branch.phoneNumber.includes(searchKeyword);

        const matchesStatus = !statusFilter ||
            (statusFilter === 'active' && branch.isActive) ||
            (statusFilter === 'inactive' && !branch.isActive);

        return matchesKeyword && matchesStatus;
    }) || [];

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý chi nhánh"
                description="Quản lý thông tin các chi nhánh"
                icon={Building}
                actions={
                    <Button
                        onClick={handleCreateBranch}
                        className="bg-gradient-to-r from-[#EC6426] to-[#F8A91F] hover:from-[#EC6426]/90 hover:to-[#F8A91F]/90 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm chi nhánh
                    </Button>
                }
            />

            {/* Stats */}
            {statistics && (
                <AdminStatsGrid>
                    <AdminStatsCard
                        title="Tổng chi nhánh"
                        value={statistics.totalBranches}
                        icon={Building}
                    />
                    <AdminStatsCard
                        title="Đang hoạt động"
                        value={statistics.activeBranches}
                        icon={CheckCircle}
                    />
                    <AdminStatsCard
                        title="Ngừng hoạt động"
                        value={statistics.inactiveBranches}
                        icon={XCircle}
                    />
                    <AdminStatsCard
                        title="Chi nhánh chính"
                        value={statistics.parentBranches}
                        icon={Crown}
                    />
                </AdminStatsGrid>
            )}

            {/* Filters */}
            <Card className="p-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, địa chỉ, số điện thoại..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                    </select>
                </div>
            </Card>

            {/* Branches Table */}
            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Đang tải danh sách chi nhánh...</p>
                    </div>
                ) : filteredBranches.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="font-semibold">Không tìm thấy chi nhánh nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b-2 border-orange-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Chi nhánh
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Địa chỉ
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Số điện thoại
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBranches.map((branch) => (
                                    <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                                                    <Building className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-gray-900">{branch.name}</p>
                                                        {branch.isParent && (
                                                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                                                <Crown className="h-3 w-3 mr-1" />
                                                                Chính
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">ID: {branch.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-700 line-clamp-2">{branch.address}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <p className="text-sm text-gray-700">{branch.phoneNumber}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${branch.isActive
                                                ? 'bg-green-100 text-green-700 border-green-300'
                                                : 'bg-red-100 text-red-700 border-red-300'
                                                }`}>
                                                {branch.isActive ? (
                                                    <>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Hoạt động
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Ngừng
                                                    </>
                                                )}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    onClick={() => handleEditBranch(branch)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                    disabled={actionLoading}
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                                {branch.isActive ? (
                                                    <Button
                                                        onClick={() => handleDeactivate(branch.id, branch.name)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        disabled={actionLoading}
                                                    >
                                                        <PowerOff className="h-3 w-3" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleActivate(branch.id, branch.name)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                                        disabled={actionLoading}
                                                    >
                                                        <Power className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Branch Form Dialog */}
            <BranchFormDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                branch={editingBranch}
                onSuccess={handleDialogSuccess}
            />

            <BranchConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={handleConfirmAction}
                type={confirmType}
                branchName={selectedBranch?.name || ''}
                loading={actionLoading}
            />
        </AdminPageLayout>
    );
}
