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

    if (new Date(formData.date) < new Date()) {
      toast.error('Ngày lịch trình không được trước ngày hôm nay');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        startTime: formatTimeForPayload(formData.startTime),
        endTime: formatTimeForPayload(formData.endTime),
      };

      await onSubmit(payload);
      toast.success(
        schedule ? 'Cập nhật lịch trình thành công!' : 'Tạo lịch trình thành công!'
      );
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting schedule:', error);
      toast.error('Có lỗi xảy ra khi lưu lịch trình');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {schedule ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình mới'}
          </DialogTitle>
          <DialogDescription>
            {schedule
              ? 'Cập nhật thông tin lịch trình cho nhân viên'
              : 'Tạo lịch trình làm việc mới cho nhân viên'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Nhân viên *</Label>
            <Select
              value={formData.userId ? formData.userId.toString() : ''}
              onValueChange={(value) =>
                setFormData({ ...formData, userId: parseInt(value) })
              }
              disabled={!!schedule}
            >
              <SelectTrigger className="w-[50%] ">
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên lịch trình *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên lịch trình"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Ngày *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Giờ bắt đầu *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Giờ kết thúc *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả (tùy chọn)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : schedule ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

