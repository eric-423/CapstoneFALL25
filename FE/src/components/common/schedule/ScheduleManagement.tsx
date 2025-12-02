'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Calendar,
    Plus,
    ChevronLeft,
    ChevronRight,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [users, setUsers] = useState<Array<{ id: number; name: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    // Dialog states
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [flagShowCurrentWeekButton, setFlagShowCurrentWeekButton] = useState(false);
    const [flagRightCurrentWeekButton, setFlagRightCurrentWeekButton] = useState(false);

    useBodyScrollLock(showFormDialog || deleteDialogOpen);

    // Fetch schedules
    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getSchedules();

            const data = (response as unknown as { data: Schedule[] }).data;
            setSchedules(data);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
            toast.error('Không thể tải danh sách lịch trình');
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        try {
            const searchRequest: UserSearchRequest = {
                page: 0,
                size: 100,
                sortBy: 'fullName',
                sortDirection: 'ASC',
            };
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
    }, []);

    useEffect(() => {
        fetchSchedules();
        fetchUsers();
    }, [fetchSchedules, fetchUsers]);

    // Handle week navigation
    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeek(newDate);
        setFlagRightCurrentWeekButton(true);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeek(newDate);
        setFlagShowCurrentWeekButton(true);
    };

    const goToCurrentWeek = () => {
        setCurrentWeek(new Date());
        setFlagShowCurrentWeekButton(false);
        setFlagRightCurrentWeekButton(false);
    };

    // Handle form submission
    const handleSubmit = async (data: CreateScheduleData | UpdateScheduleData) => {
        try {
            if (editingSchedule) {
                await updateSchedule(editingSchedule.id, data as UpdateScheduleData);
            } else {
                await createSchedule(data as CreateScheduleData);
            }
            await fetchSchedules();
            setEditingSchedule(null);
            setSelectedDate(undefined);
            setSelectedUserId(undefined);
        } catch (error) {
            console.error('Failed to save schedule:', error);
            throw error;
        }
    };

    // Handle delete
    const handleDeleteRequest = (schedule: Schedule) => {
        setScheduleToDelete(schedule);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        if (deleteLoading) return;
        setDeleteDialogOpen(false);
        setScheduleToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!scheduleToDelete) return;
        try {
            setDeleteLoading(true);
            await deleteSchedule(scheduleToDelete.id);
            toast.success('Xóa lịch trình thành công!');
            await fetchSchedules();
            setDeleteDialogOpen(false);
            setScheduleToDelete(null);
        } catch (error) {
            console.error('Failed to delete schedule:', error);
            toast.error('Không thể xóa lịch trình');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Handle edit
    const handleEdit = (schedule: Schedule) => {
        // Kiểm tra xem schedule có phải là quá khứ không
        if (schedule.date) {
            const scheduleDate = new Date(schedule.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            scheduleDate.setHours(0, 0, 0, 0);

            // Nếu ngày đã qua
            if (scheduleDate < today) {
                toast.error('Không thể chỉnh sửa lịch trình đã qua');
                return;
            }

            // Nếu là hôm nay, kiểm tra thời gian kết thúc
            if (scheduleDate.getTime() === today.getTime() && schedule.endTime) {
                const [hours, minutes] = schedule.endTime.split(':');
                const endTime = new Date();
                endTime.setHours(parseInt(hours || '0'), parseInt(minutes || '0'), 0, 0);
                const now = new Date();
                if (now > endTime) {
                    toast.error('Không thể chỉnh sửa ca đã kết thúc');
                    return;
                }
            }
        }

        const normalizedDate = schedule.date ? new Date(schedule.date) : undefined;
        if (normalizedDate) {
            normalizedDate.setHours(12, 0, 0, 0);
        }

        setEditingSchedule(schedule);
        setSelectedDate(normalizedDate);
        setSelectedUserId(schedule.userId);
        setShowFormDialog(true);
    };

    // Handle cell click (create new schedule for that date)
    const handleCellClick = (date: Date) => {
        const normalizedDate = new Date(date);
        normalizedDate.setHours(12, 0, 0, 0);
        normalizedDate.setDate(normalizedDate.getDate());
        setEditingSchedule(null);
        setSelectedDate(normalizedDate);
        setSelectedUserId(undefined);
        setShowFormDialog(true);
    };

    // Handle create new
    const handleCreateNew = () => {
        setEditingSchedule(null);
        setSelectedDate(undefined);
        setSelectedUserId(undefined);
        setShowFormDialog(true);
    };

    // Calculate week range
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

    // Calculate stats (bảo vệ khi schedules có thể bị undefined do response lỗi)
    const safeSchedules = Array.isArray(schedules) ? schedules : [];
    const totalSchedules = safeSchedules.length;
    const thisWeekSchedules = safeSchedules.filter((schedule) => {
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

    return (
        <AdminPageLayout>
            <AdminPageHeader
                title="Quản lý lịch trình"
                description="Quản lý lịch trình làm việc của nhân viên"
                icon={Calendar}
                actions={
                    <Button
                        onClick={handleCreateNew}
                        className="bg-[#EC6426] hover:bg-[#EC6426]/90 w-full sm:w-auto"
                        size="sm"
                    >
                        <Plus className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Tạo lịch trình</span>
                        <span className="sm:hidden">Tạo mới</span>
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Tổng lịch trình</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalSchedules}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Lịch trình tuần này</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{thisWeekSchedules}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Week Navigation */}
            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-200 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    {/* Left: Previous Week Button */}
                    <div className="flex items-center gap-2 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPreviousWeek}
                            className="flex items-center gap-1 sm:gap-2 hover:bg-orange-50 hover:border-orange-300 flex-1 sm:flex-initial"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Tuần trước</span>
                            <span className="sm:hidden text-xs">Trước</span>
                        </Button>
                    </div>

                    {/* Center: Current Week Display */}
                    <div className="flex flex-col items-center gap-2 order-1 sm:order-2 flex-1 w-full sm:w-auto">
                        <div className="text-center">
                            <p className="text-base sm:text-lg font-bold text-gray-900">
                                {weekRange.start} - {weekRange.end}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Tuần hiện tại</p>
                        </div>

                        {(flagShowCurrentWeekButton || flagRightCurrentWeekButton) && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={goToCurrentWeek}
                                className="bg-[#EC6426] hover:bg-[#EC6426]/90 text-white text-xs px-3 sm:px-4"
                            >
                                <span className="hidden sm:inline">Hiện Tại</span>
                                <span className="sm:hidden">Hôm nay</span>
                            </Button>
                        )}
                    </div>

                    {/* Right: Next Week Button */}
                    <div className="flex items-center gap-2 order-3 w-full sm:w-auto justify-center sm:justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextWeek}
                            className="flex items-center gap-1 sm:gap-2 hover:bg-orange-50 hover:border-orange-300 flex-1 sm:flex-initial"
                        >
                            <span className="hidden sm:inline">Tuần sau</span>
                            <span className="sm:hidden text-xs">Sau</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Schedule Table */}
            {loading ? (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-500">Đang tải lịch trình...</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-2 sm:p-6 shadow-sm border border-gray-200 overflow-hidden">
                    <ScheduleTable
                        schedules={schedules}
                        currentWeek={currentWeek}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                        onCellClick={handleCellClick}
                    />
                </div>
            )}

            {/* Form Dialog */}
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
                        <Button variant="outline" onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteLoading}>
                            {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPageLayout>
    );
}


