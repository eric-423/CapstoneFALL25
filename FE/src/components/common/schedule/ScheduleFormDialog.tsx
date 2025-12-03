'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Schedule, CreateScheduleData, UpdateScheduleData } from '@/apis/schedule.api';
import { toast } from 'react-toastify';
import { useBodyScrollLock } from '@/components/common/useBodyScrollLock';

interface ScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: Schedule | null;
  selectedDate?: Date;
  selectedUserId?: number;
  users: Array<{ id: number; name: string }>;
  onSubmit: (data: CreateScheduleData | UpdateScheduleData) => Promise<void>;
}

const formatTimeForInput = (time?: string | null) => {
  if (!time) return '';
  return time.length >= 5 ? time.slice(0, 5) : time;
};

const formatTimeForPayload = (time: string) => {
  if (!time) return time;
  return time.length === 5 ? `${time}:00` : time;
};

export function ScheduleFormDialog({
  open,
  onOpenChange,
  schedule,
  selectedDate,
  selectedUserId,
  users,
  onSubmit,
}: ScheduleFormDialogProps) {
  const [formData, setFormData] = useState({
    userId: selectedUserId || schedule?.userId || 0,
    name: schedule?.name || '',
    description: schedule?.description || '',
    date: selectedDate
      ? selectedDate.toISOString().split('T')[0]
      : schedule?.date
        ? schedule.date.split('T')[0]
        : '',
    startTime: formatTimeForInput(schedule?.startTime) || '08:00',
    endTime: formatTimeForInput(schedule?.endTime) || '17:00',
  });

  const [loading, setLoading] = useState(false);
  useBodyScrollLock(open);

  useEffect(() => {
    if (open) {
      setFormData({
        userId: selectedUserId || schedule?.userId || 0,
        name: schedule?.name || '',
        description: schedule?.description || '',
        date: selectedDate
          ? selectedDate.toISOString().split('T')[0]
          : schedule?.date
            ? schedule.date.split('T')[0]
            : '',
        startTime: formatTimeForInput(schedule?.startTime) || '08:00',
        endTime: formatTimeForInput(schedule?.endTime) || '17:00',
      });
    }
  }, [open, schedule, selectedDate, selectedUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      toast.error('Vui lòng chọn nhân viên');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên lịch trình');
      return;
    }

    if (!formData.date) {
      toast.error('Vui lòng chọn ngày');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error('Vui lòng nhập đầy đủ thời gian');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    // Kiểm tra ngày không được là quá khứ
    const selectedDateObj = new Date(formData.date);
    selectedDateObj.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDateObj < today) {
      toast.error('Ngày lịch trình không được trước ngày hôm nay');
      return;
    }

    try {
      setLoading(true);
      
      // Đảm bảo userId luôn có khi update
      const userId = schedule ? (schedule.userId || formData.userId) : formData.userId;
      
      const payload = {
        userId: userId,
        name: formData.name,
        description: formData.description || '',
        date: formData.date,
        startTime: formatTimeForPayload(formData.startTime),
        endTime: formatTimeForPayload(formData.endTime),
      };

      console.log('Submitting schedule payload:', payload);
      await onSubmit(payload);
      toast.success(
        schedule ? 'Cập nhật lịch trình thành công!' : 'Tạo lịch trình thành công!'
      );
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error submitting schedule:', error);
      const errorMessage = error?.message || 'Có lỗi xảy ra khi lưu lịch trình';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[550px] max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {schedule ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình mới'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {schedule
              ? 'Cập nhật thông tin lịch trình làm việc cho nhân viên'
              : 'Điền thông tin để tạo lịch trình làm việc mới cho nhân viên'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mt-3 sm:mt-4">
          {/* Nhân viên */}
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-xs sm:text-sm font-semibold">
              Nhân viên <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.userId ? formData.userId.toString() : ''}
              onValueChange={(value) =>
                setFormData({ ...formData, userId: parseInt(value) })
              }
              disabled={!!schedule}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent 
                className="z-[102] max-h-[300px] !fixed" 
                position="popper"
                sideOffset={4}
              >
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!!schedule && (
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Không thể thay đổi nhân viên sau khi tạo lịch trình
              </p>
            )}
          </div>

          {/* Tên lịch trình */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm font-semibold">
              Tên lịch trình <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: Ca sáng, Ca chiều, Ca tối..."
              required
              className="w-full text-sm"
            />
          </div>

          {/* Ngày */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-xs sm:text-sm font-semibold">
              Ngày <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full text-sm"
            />
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-xs sm:text-sm font-semibold">
                Giờ bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
                className="w-full text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-xs sm:text-sm font-semibold">
                Giờ kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
                className="w-full text-sm"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm font-semibold">
              Mô tả <span className="text-gray-400 text-[10px] sm:text-xs">(tùy chọn)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả chi tiết về lịch trình (nếu có)..."
              rows={3}
              className="w-full text-sm"
            />
          </div>

          <DialogFooter className="gap-2 pt-3 sm:pt-4 flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 sm:flex-initial w-full sm:w-auto order-2 sm:order-1"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#EC6426] hover:bg-[#EC6426]/90 flex-1 sm:flex-initial w-full sm:w-auto order-1 sm:order-2"
            >
              {loading ? 'Đang lưu...' : schedule ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}








