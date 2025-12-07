'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Calendar,
    Plus,
    ChevronLeft,
    ChevronRight,
    Clock,
    CalendarCheck,
    Search,
    X,
    Filter,
    Settings,
    Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScheduleTable } from '@/components/common/schedule/ScheduleTable';
import { ScheduleFormDialog } from '@/components/common/schedule/ScheduleFormDialog';
import { ShiftManagementDialog } from '@/components/common/schedule/ShiftManagementDialog';
import { ImportScheduleDialog } from '@/components/common/schedule/ImportScheduleDialog';
import {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    type Schedule,
    type CreateScheduleData,
    type UpdateScheduleData,
} from '@/apis/schedule.api';
import { getAllUsers, type UserSearchRequest } from '@/apis/user.api';
import { toast } from 'react-toastify';
import { User } from '@/apis/admin-user.api';
import type {
    AdminPageLayoutProps,
    AdminPageHeaderProps,
} from '@/app/admin/components/AdminPageLayout';
import { AdminCard } from '@/app/admin/components/AdminCard';
import { getCookie } from '@/utils/cookies.client';
import { usePathname } from 'next/navigation';
import { getBranches, type Branch } from '@/apis/branch.api';
import { Building2 } from 'lucide-react';

interface ScheduleManagementProps {
    AdminPageLayout: React.ComponentType<AdminPageLayoutProps>;
    AdminPageHeader: React.ComponentType<AdminPageHeaderProps>;
    useBodyScrollLock: (open: boolean) => void;
}

export function ScheduleManagement({
    AdminPageLayout,
    AdminPageHeader,
    useBodyScrollLock,
}: ScheduleManagementProps) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin') || false;

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [users, setUsers] = useState<Array<{ id: number; name: string }>>([]);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

    // Dialog states
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
    const [showShiftDialog, setShowShiftDialog] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);

    // Filter states
    const [searchName, setSearchName] = useState('');
    const [filterShift, setFilterShift] = useState<string>('all');

    useBodyScrollLock(showFormDialog || deleteDialogOpen || showShiftDialog || showImportDialog);

    const fetchSchedules = useCallback(async () => {
        try {
            // Nếu là admin và có chọn chi nhánh, truyền branchId
            // Nếu không phải admin, không truyền branchId (API sẽ tự lấy từ token)
            const branchId = isAdmin && selectedBranchId ? selectedBranchId : undefined;
            const response = await getSchedules(branchId);

            const data = (response as unknown as { data: Schedule[] }).data;
            setSchedules(data);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
            toast.error('Không thể tải danh sách lịch trình');
            setSchedules([]);
        }
    }, [isAdmin, selectedBranchId]);

    const fetchUsers = useCallback(async () => {
        try {
            const searchRequest: UserSearchRequest = {
                page: 0,
                size: 100,
                sortBy: 'fullName',
                sortDirection: 'ASC',
            };

            if (isAdmin && selectedBranchId) {
                searchRequest.branchId = selectedBranchId;
            } else if (!isAdmin) {
                const branchId = getCookie('branchId');
                if (branchId) {
                    searchRequest.branchId = parseInt(branchId);
                }
            }

            const response = await getAllUsers(searchRequest);
            const userList = response.data.content.map((user: User) => ({
                id: user.id,
                name: user.fullName,
            }));
            setUsers(userList);

        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Không thể tải danh sách nhân viên');
        }

    }, [isAdmin, selectedBranchId]);

    const fetchBranches = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const branchesData = await getBranches();
            setBranches(branchesData);
        } catch (error) {
            console.error('Failed to fetch branches:', error);
            toast.error('Không thể tải danh sách chi nhánh');
        }
    }, [isAdmin]);

    useEffect(() => {
        fetchSchedules();
        fetchUsers();
        if (isAdmin) {
            fetchBranches();
        }
    }, [fetchSchedules, fetchUsers, fetchBranches, isAdmin]);

    const isCurrentWeek = () => {
        const today = new Date();
        const todayDay = today.getDay();
        const todayMonday = new Date(today);
        todayMonday.setDate(today.getDate() - todayDay + (todayDay === 0 ? -6 : 1));
        todayMonday.setHours(0, 0, 0, 0);

        const currentMonday = new Date(currentWeek);
        const currentDay = currentMonday.getDay();
        currentMonday.setDate(currentMonday.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
        currentMonday.setHours(0, 0, 0, 0);

        return todayMonday.getTime() === currentMonday.getTime();
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeek(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeek(newDate);
    };

    const goToCurrentWeek = () => {
        setCurrentWeek(new Date());
    };

    const handleSubmit = async (data: CreateScheduleData | UpdateScheduleData) => {
        try {
            // Tạo payload và xóa startTime và endTime (backend không cần)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { startTime, endTime, ...dataWithoutTime } = data;
            const payload: CreateScheduleData | UpdateScheduleData = { ...dataWithoutTime };

            if (editingSchedule) {
                setSchedules(prev => prev.map(s =>
                    s.id === editingSchedule.id
                        ? { ...s, ...payload as UpdateScheduleData, name: (payload as UpdateScheduleData).name || s.name }
                        : s
                ));
                const updateResponse = await updateSchedule(editingSchedule.id, payload as UpdateScheduleData);
                console.log('Update schedule response:', updateResponse);
            } else {
                const tempSchedule: Schedule = {
                    id: Date.now(),
                    userId: (payload as CreateScheduleData).userId,
                    userName: users.find(u => u.id === (payload as CreateScheduleData).userId)?.name || '',
                    name: (payload as CreateScheduleData).name,
                    description: (payload as CreateScheduleData).description || null,
                    date: (payload as CreateScheduleData).date,
                    startTime: (payload as CreateScheduleData).startTime || null,
                    endTime: (payload as CreateScheduleData).endTime || null,
                };
                setSchedules(prev => [...prev, tempSchedule]);
                const createResponse = await createSchedule(payload as CreateScheduleData);
                console.log('Create schedule response:', createResponse);

                if (createResponse.status !== 0 && createResponse.status !== 200) {
                    setSchedules(prev => prev.filter(s => s.id !== tempSchedule.id));

                    const errorDesc = createResponse.desc || '';
                    if (errorDesc.includes('Schedule for this user, shift and date already exists') ||
                        errorDesc.includes('already exists')) {
                        throw new Error('Nhân viên đã có lịch trình trong ca này');
                    } else {
                        throw new Error(errorDesc || 'Không thể tạo lịch trình');
                    }
                }

            }
            await fetchSchedules();
            setEditingSchedule(null);
            setSelectedDate(undefined);
            setSelectedUserId(undefined);
        } catch (error) {
            await fetchSchedules();
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(errorMessage);
        }
    };

    const handleDeleteRequest = (schedule: Schedule) => {
        setScheduleToDelete(schedule);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setScheduleToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!scheduleToDelete) return;
        const scheduleId = scheduleToDelete.id;
        try {
            setSchedules(prev => prev.filter(s => s.id !== scheduleId));
            setDeleteDialogOpen(false);
            setScheduleToDelete(null);

            await deleteSchedule(scheduleId);
            toast.success('Xóa lịch trình thành công!');
            await fetchSchedules();
        } catch (error) {
            await fetchSchedules();
            console.error('Failed to delete schedule:', error);
            toast.error('Không thể xóa lịch trình');
        }
    };

    const handleEdit = (schedule: Schedule) => {
        const normalizedDate = schedule.date ? new Date(schedule.date) : undefined;
        if (normalizedDate) {
            normalizedDate.setHours(12, 0, 0, 0);
        }

        setEditingSchedule(schedule);
        setSelectedDate(normalizedDate);
        setSelectedUserId(schedule.userId);
        setShowFormDialog(true);
    };

    const handleCellClick = (date: Date) => {
        const normalizedDate = new Date(date);
        normalizedDate.setHours(12, 0, 0, 0);
        normalizedDate.setDate(normalizedDate.getDate());
        setEditingSchedule(null);
        setSelectedDate(normalizedDate);
        setSelectedUserId(undefined);
        setShowFormDialog(true);
    };

    const handleCreateNew = () => {
        setEditingSchedule(null);
        setSelectedDate(undefined);
        setSelectedUserId(undefined);
        setShowFormDialog(true);
    };

    const getWeekRange = () => {
        const monday = new Date(currentWeek);
        const day = monday.getDay();
        const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
        monday.setDate(diff);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return {
            start: monday.toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
            }),
            end: sunday.toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            }),
        };
    };

    const weekRange = getWeekRange();

    const safeSchedules = useMemo(() => (Array.isArray(schedules) ? schedules : []), [schedules]);

    const filteredSchedules = useMemo(() => {
        return safeSchedules.filter((schedule) => {
            if (searchName.trim()) {
                const searchLower = searchName.toLowerCase().trim();
                const nameMatch = schedule.userName?.toLowerCase().includes(searchLower) ||
                    schedule.name?.toLowerCase().includes(searchLower);
                if (!nameMatch) return false;
            }

            if (filterShift !== 'all' && schedule.startTime) {
                const startHour = parseInt(schedule.startTime.split(':')[0] || '0');
                const endHour = schedule.endTime ? parseInt(schedule.endTime.split(':')[0] || '0') : startHour;

                switch (filterShift) {
                    case 'morning':
                        if (startHour >= 12) return false;
                        break;
                    case 'afternoon':
                        if (startHour >= 17 || endHour <= 12) return false;
                        break;
                    case 'evening':
                        if (endHour < 17 && startHour < 17) return false;
                        break;
                }
            }

            return true;
        });
    }, [safeSchedules, searchName, filterShift]);

    const hasActiveFilters = searchName.trim() !== '' || filterShift !== 'all';

    const clearFilters = () => {
        setSearchName('');
        setFilterShift('all');
    };

    const currentWeekSchedules = safeSchedules.filter((schedule) => {
        if (!schedule.date) return false;
        const scheduleDate = new Date(schedule.date);
        const monday = new Date(currentWeek);
        const day = monday.getDay();
        const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        return scheduleDate >= monday && scheduleDate <= sunday;
    }).length;

    const upcomingSchedules = safeSchedules.filter((schedule) => {
        if (!schedule.date) return false;
        const scheduleDate = new Date(schedule.date);
        scheduleDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const monday = new Date(currentWeek);
        const day = monday.getDay();
        const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        return scheduleDate >= today && scheduleDate <= sunday;
    }).length;

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý lịch trình"
                description="Quản lý lịch trình làm việc của nhân viên"
                icon={Calendar}
                actions={
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            onClick={() => setShowShiftDialog(true)}
                            variant="outline"
                            className="border-[#78A243] text-[#78A243] hover:bg-[#78A243]/10 w-full sm:w-auto"
                            size="sm"
                        >
                            <Settings className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Quản lý ca</span>
                            <span className="sm:hidden">Ca</span>
                        </Button>
                        <Button
                            onClick={() => setShowImportDialog(true)}
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                            size="sm"
                        >
                            <Upload className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Import Excel</span>
                            <span className="sm:hidden">Import</span>
                        </Button>
                        <Button
                            onClick={handleCreateNew}
                            className="bg-[#78A243] hover:bg-[#78A243]/90 w-full sm:w-auto"
                            size="sm"
                        >
                            <Plus className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Tạo lịch trình</span>
                            <span className="sm:hidden">Tạo mới</span>
                        </Button>
                    </div>
                }
            />

            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex gap-4 flex-shrink-0">
                    <div className="min-w-[200px]">
                        <AdminCard
                            title={isCurrentWeek() ? 'Lịch trình tuần này' : `Tuần ${weekRange.start} - ${weekRange.end}`}
                            value={currentWeekSchedules}
                            icon={isCurrentWeek() ? Clock : Calendar}
                        />
                    </div>
                    {isCurrentWeek() && (
                        <div className="min-w-[200px]">
                            <AdminCard
                                title="Lịch trình sắp tới"
                                value={upcomingSchedules}
                                icon={CalendarCheck}
                                subtitle="Từ hôm nay đến cuối tuần"
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1 flex items-center justify-end gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Tìm theo tên nhân viên..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="pl-9 pr-8 h-10 border-gray-200 focus:border-[#78A243] focus:ring-[#78A243]/20"
                        />
                        {searchName && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchName('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-3.5 h-3.5 text-gray-400" />
                            </Button>
                        )}
                    </div>

                    {isAdmin && branches.length > 0 && (
                        <Select
                            value={selectedBranchId ? selectedBranchId.toString() : 'all'}
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    setSelectedBranchId(null);
                                } else {
                                    setSelectedBranchId(parseInt(value));
                                }
                            }}
                        >
                            <SelectTrigger className="w-[180px] h-10 border-gray-200 focus:border-[#78A243] focus:ring-[#78A243]/20">
                                <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                <SelectValue placeholder="Chọn chi nhánh" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                                {branches.map((branch) => (
                                    <SelectItem key={branch.id} value={branch.id.toString()}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Select value={filterShift} onValueChange={setFilterShift}>
                        <SelectTrigger className="w-[140px] h-10 border-gray-200 focus:border-[#78A243] focus:ring-[#78A243]/20">
                            <Filter className="w-4 h-4 mr-2 text-gray-400" />
                            <SelectValue placeholder="Ca làm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả ca</SelectItem>
                            <SelectItem value="morning">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Ca sáng
                                </span>
                            </SelectItem>
                            <SelectItem value="afternoon">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                    Ca chiều
                                </span>
                            </SelectItem>
                            <SelectItem value="evening">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                                    Ca tối
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-10 px-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Xóa lọc
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-4 px-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousWeek}
                    className="h-8 px-2 sm:px-3 border-[#78A243]/30 hover:bg-[#78A243]/10 hover:border-[#78A243] text-[#2D1E1A]"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Trước</span>
                </Button>

                <div className="flex items-center gap-2">
                    <div className="text-center">
                        <span className="text-sm sm:text-base font-semibold text-[#2D1E1A]">
                            {weekRange.start} - {weekRange.end}
                        </span>
                    </div>

                    {!isCurrentWeek() && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={goToCurrentWeek}
                            className="h-7 bg-[#78A243] hover:bg-[#78A243]/90 text-white text-xs px-2"
                        >
                            Hôm nay
                        </Button>
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextWeek}
                    className="h-8 px-2 sm:px-3 border-[#78A243]/30 hover:bg-[#78A243]/10 hover:border-[#78A243] text-[#2D1E1A]"
                >
                    <span className="hidden sm:inline mr-1">Sau</span>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-6">
                {hasActiveFilters && (
                    <div className="mb-3 px-1 flex items-center gap-2 text-sm text-gray-500">
                        <span>Đang hiển thị {filteredSchedules.length} / {safeSchedules.length} lịch trình</span>
                        {filteredSchedules.length === 0 && (
                            <span className="text-amber-600">- Không tìm thấy kết quả phù hợp</span>
                        )}
                    </div>
                )}
                <ScheduleTable
                    schedules={filteredSchedules}
                    currentWeek={currentWeek}
                    onEdit={handleEdit}
                    onDelete={handleDeleteRequest}
                    onCellClick={handleCellClick}
                />
            </div>

            <ScheduleFormDialog
                open={showFormDialog}
                onOpenChange={(open) => {
                    setShowFormDialog(open);
                    if (!open) {
                        setEditingSchedule(null);
                        setSelectedDate(undefined);
                        setSelectedUserId(undefined);
                    }
                }}
                schedule={editingSchedule}
                selectedDate={selectedDate}
                selectedUserId={selectedUserId}
                users={users}
                onSubmit={handleSubmit}
            />

            <Dialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCloseDeleteDialog();
                    } else {
                        setDeleteDialogOpen(true);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Xóa lịch trình?</DialogTitle>
                        <DialogDescription>
                            Hành động này không thể hoàn tác.<br /> Lịch trình sẽ bị xóa vĩnh viễn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>
                            Nhân viên:{' '}
                            <span className="font-semibold text-gray-900">
                                {scheduleToDelete?.userName || 'Không xác định'}
                            </span>
                        </p>
                        {scheduleToDelete?.name && (
                            <p>
                                Tên lịch trình:{' '}
                                <span className="font-semibold text-gray-900">
                                    {scheduleToDelete.name}
                                </span>
                            </p>
                        )}
                        {scheduleToDelete?.date && (
                            <p>
                                Ngày:{' '}
                                <span className="font-semibold text-gray-900">
                                    {new Date(scheduleToDelete.date).toLocaleDateString('vi-VN')}
                                </span>
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDeleteDialog}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ShiftManagementDialog
                open={showShiftDialog}
                onOpenChange={setShowShiftDialog}
            />

            <ImportScheduleDialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
                users={users}
                onSuccess={fetchSchedules}
            />
        </AdminPageLayout>
    );
}


