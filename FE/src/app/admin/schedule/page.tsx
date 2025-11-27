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
import { AdminPageLayout, AdminPageHeader } from '../components/AdminPageLayout';
import { ScheduleTable } from './components/ScheduleTable';
import { ScheduleFormDialog } from './components/ScheduleFormDialog';
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

export default function SchedulePage() {
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
    // Fetch schedules
    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getSchedules();
            setSchedules(response.data || []);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
            toast.error('Không thể tải danh sách lịch trình');
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
            // const filteredUserList = userList.filter((user: { id: number }) => user.id !== 1);
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

    // Calculate stats
    const totalSchedules = schedules.length;
    const thisWeekSchedules = schedules.filter((schedule) => {
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
                    <Button onClick={handleCreateNew} className="bg-[#EC6426] hover:bg-[#EC6426]/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo lịch trình
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Tổng lịch trình</p>
                            <p className="text-2xl font-bold text-gray-900">{totalSchedules}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Lịch trình tuần này</p>
                            <p className="text-2xl font-bold text-gray-900">{thisWeekSchedules}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center justify-between">



                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPreviousWeek}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Tuần trước
                        </Button>


                        {
                            flagRightCurrentWeekButton && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToCurrentWeek}
                                    className="text-xs"
                                >
                                    Hôm nay
                                </Button>
                            )
                        }
                    </div>



                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-700">
                                {weekRange.start} - {weekRange.end}
                            </p>
                            <p className="text-xs text-gray-500">Tuần hiện tại</p>
                        </div>

                    </div>

                    <div className='flex items-center gap-2'>
                        {
                            flagShowCurrentWeekButton && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToCurrentWeek}
                                    className="text-xs"
                                >
                                    Hôm nay
                                </Button>
                            )
                        }

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextWeek}
                            className="flex items-center gap-2"
                        >
                            Tuần sau
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

                <>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <ScheduleTable
                            schedules={schedules}
                            currentWeek={currentWeek}
                            onEdit={handleEdit}
                            onDelete={handleDeleteRequest}
                            onCellClick={handleCellClick}
                        />

                    </div>

                </>


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

