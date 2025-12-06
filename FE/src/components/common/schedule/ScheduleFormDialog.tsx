'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { X, Calendar, CheckCircle, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
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
import { Schedule, CreateScheduleData, UpdateScheduleData, getShifts, type Shift } from '@/apis/schedule.api';
import { getCookie } from '@/utils/cookies.client';
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
    startTime: formatTimeForInput(schedule?.startTime) || '',
    endTime: formatTimeForInput(schedule?.endTime) || '',
    shiftId: (schedule as Schedule & { shiftId?: number })?.shiftId || 0,
  });

  const [shifts, setShifts] = useState<Shift[]>([]);


  const isViewOnly = useMemo(() => {
    if (!schedule?.date) return false;

    const scheduleDate = new Date(schedule.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);

    if (scheduleDate < today) return true;

    if (scheduleDate.getTime() === today.getTime() && schedule.endTime) {
      const [hours, minutes] = schedule.endTime.split(':');
      const endTime = new Date();
      endTime.setHours(parseInt(hours || '0'), parseInt(minutes || '0'), 0, 0);
      const now = new Date();
      if (now > endTime) return true;
    }

    return false;
  }, [schedule]);

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
        startTime: formatTimeForInput(schedule?.startTime) || '',
        endTime: formatTimeForInput(schedule?.endTime) || '',
        shiftId: (schedule as Schedule & { shiftId?: number })?.shiftId || 0,
      });

      fetchShifts();
    }
  }, [open, schedule, selectedDate, selectedUserId]);

  const fetchShifts = async () => {
    try {
      const branchId = getCookie('branchId');
      let branchIdNum: number | undefined;

      if (branchId) {
        const parsed = parseInt(branchId, 10);
        if (!isNaN(parsed) && parsed > 0) {
          branchIdNum = parsed;
        }
      }

      const response = await getShifts(branchIdNum);
      if (response.status === 0 && response.data) {
        setShifts(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewOnly) {
      onOpenChange(false);
      return;
    }

    if (!formData.userId) {
      toast.error('Vui lòng chọn nhân viên');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên lịch trình');
      return;
    }

    // Kiểm tra các trường có giá trị
    const hasDate = formData.date && formData.date.trim() !== '';
    const hasShiftId = formData.shiftId && formData.shiftId > 0;
    const hasStartTime = formData.startTime && formData.startTime.trim() !== '';
    const hasEndTime = formData.endTime && formData.endTime.trim() !== '';
    const hasTime = hasStartTime && hasEndTime;

    if (hasShiftId && hasTime) {
      toast.error('Vui lòng chỉ chọn ca làm việc hoặc nhập thời gian, không được chọn cả hai');
      return;
    }

    if (!hasTime) {
      if (!hasDate && !hasShiftId) {
        toast.error('Vui lòng chọn ngày hoặc ca làm việc');
        return;
      }
    }

    if (hasStartTime && hasEndTime) {
      const startParts = formData.startTime.split(':');
      const endParts = formData.endTime.split(':');
      const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1] || '0');
      const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1] || '0');

      if (startMinutes === endMinutes) {
        toast.error('Thời gian bắt đầu và kết thúc không được giống nhau');
        return;
      }
    } else if (hasStartTime || hasEndTime) {
      toast.error('Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc');
      return;
    }

    if (hasDate) {
      const selectedDateObj = new Date(formData.date);
      selectedDateObj.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDateObj < today) {
        toast.error('Ngày lịch trình không được trước ngày hôm nay');
        return;
      }
    }

    try {
      const userId = schedule ? (schedule.userId || formData.userId) : formData.userId;

      const payload: CreateScheduleData | UpdateScheduleData = {
        userId: userId,
        name: formData.name,
        description: formData.description || '',
      };

      if (hasDate) {
        payload.date = formData.date;
      }

      if (hasTime) {
        if (formData.startTime) {
          payload.startTime = formatTimeForPayload(formData.startTime);
        }
        if (formData.endTime) {
          payload.endTime = formatTimeForPayload(formData.endTime);
        }
        payload.shiftId = 0;
      } else {
        if (hasShiftId) {
          payload.shiftId = formData.shiftId;
        }
      }

      await onSubmit(payload);
      toast.success(
        schedule ? 'Cập nhật lịch trình thành công!' : 'Tạo lịch trình thành công!'
      );
      onOpenChange(false);
    } catch (error: unknown) {
      console.error('Error submitting schedule:', error);
      const errorMessage = error instanceof Error ? error.message : String(error) || 'Có lỗi xảy ra khi lưu lịch trình';
      toast.error(errorMessage);
    }
  };

  const getDialogTitle = () => {
    if (isViewOnly) return 'Chi tiết lịch trình';
    if (schedule) return 'Chỉnh sửa lịch trình';
    return 'Tạo lịch trình mới';
  };

  const getHeaderColor = () => {
    if (isViewOnly) return 'bg-gray-500';
    return 'bg-[#78A243]';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto flex flex-col p-0 gap-0 bg-white border border-gray-200 rounded-xl [&>button]:hidden">
        <div className={`${getHeaderColor()} p-4 flex items-center justify-between shrink-0 rounded-t-xl`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center">
              {isViewOnly ? (
                <Eye className="h-5 w-5 text-white" />
              ) : (
                <Calendar className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {getDialogTitle()}
              </DialogTitle>
              {isViewOnly && (
                <p className="text-white/70 text-sm mt-0.5">Lịch trình đã qua - chỉ xem</p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId" className="font-semibold text-gray-800">
                Nhân viên {!isViewOnly && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={formData.userId ? formData.userId.toString() : ''}
                onValueChange={(value) =>
                  setFormData({ ...formData, userId: parseInt(value) })
                }
                disabled={!!schedule || isViewOnly}
              >
                <SelectTrigger className="w-full focus:border-[#78A243] focus:ring-[#78A243]/20">
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent
                  className="z-[102] max-h-[300px]"
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
              {!!schedule && !isViewOnly && (
                <p className="text-xs text-gray-500">
                  Không thể thay đổi nhân viên sau khi tạo lịch trình
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-gray-800">
                Tên lịch trình {!isViewOnly && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Ca sáng, Ca chiều, Ca tối..."
                required={!isViewOnly}
                disabled={isViewOnly}
                className="focus:border-[#78A243] focus:ring-[#78A243]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="font-semibold text-gray-800">
                Ngày {!isViewOnly && <span className="text-gray-400 text-xs">(tùy chọn hoặc chọn ca làm việc)</span>}
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                disabled={isViewOnly}
                className="focus:border-[#78A243] focus:ring-[#78A243]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="font-semibold text-gray-800">
                  Giờ bắt đầu {!isViewOnly && <span className="text-gray-400 text-xs">(tùy chọn)</span>}
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => {
                    const newStartTime = e.target.value;
                    setFormData({
                      ...formData,
                      startTime: newStartTime,
                      shiftId: 0
                    });
                  }}
                  disabled={isViewOnly}
                  className="focus:border-[#78A243] focus:ring-[#78A243]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="font-semibold text-gray-800">
                  Giờ kết thúc {!isViewOnly && <span className="text-gray-400 text-xs">(tùy chọn)</span>}
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => {
                    const newEndTime = e.target.value;
                    setFormData({
                      ...formData,
                      endTime: newEndTime,
                      shiftId: 0
                    });
                  }}
                  disabled={isViewOnly}
                  className="focus:border-[#78A243] focus:ring-[#78A243]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shiftId" className="font-semibold text-gray-800">
                Ca làm việc {!isViewOnly && <span className="text-gray-400 text-xs">(tùy chọn hoặc chọn ngày)</span>}
              </Label>
              <Select
                value={formData.shiftId ? formData.shiftId.toString() : ''}
                onValueChange={(value) => {
                  const newShiftId = parseInt(value) || 0;
                  setFormData({
                    ...formData,
                    shiftId: newShiftId,
                    startTime: '',
                    endTime: ''
                  });
                }}
                disabled={isViewOnly}
              >
                <SelectTrigger className="w-full focus:border-[#78A243] focus:ring-[#78A243]/20">
                  <SelectValue placeholder="Chọn ca làm việc (tùy chọn)" />
                </SelectTrigger>
                <SelectContent
                  className="z-[102] max-h-[300px]"
                  position="popper"
                  sideOffset={4}
                >
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id.toString()}>
                      {shift.name} ({formatTimeForInput(shift.startTime)} - {formatTimeForInput(shift.endTime)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold text-gray-800">
                Mô tả {!isViewOnly && <span className="text-gray-400 text-xs">(tùy chọn)</span>}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={isViewOnly ? 'Không có mô tả' : 'Nhập mô tả chi tiết về lịch trình (nếu có)...'}
                rows={3}
                disabled={isViewOnly}
                className="focus:border-[#78A243] focus:ring-[#78A243]/20"
              />
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-gray-200 bg-gray-50 shrink-0 rounded-b-xl flex gap-3 justify-end">
            {isViewOnly ? (
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold"
              >
                Đóng
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-5 py-2.5 bg-[#78A243] hover:bg-[#78A243]/90 text-white font-semibold"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {schedule ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

