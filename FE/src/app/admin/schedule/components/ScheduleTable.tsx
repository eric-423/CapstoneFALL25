'use client';

import React, { useMemo } from 'react';
import { Schedule } from '@/apis/schedule.api';
import { ScheduleCard } from './ScheduleCard';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/lib/utils';

interface ScheduleTableProps {
  schedules: Schedule[];
  currentWeek: Date;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  onCellClick?: (date: Date) => void;
}

const DAYS_OF_WEEK = [
  { label: 'Thứ 2', shortLabel: 'T2', dayOfWeek: 1 },
  { label: 'Thứ 3', shortLabel: 'T3', dayOfWeek: 2 },
  { label: 'Thứ 4', shortLabel: 'T4', dayOfWeek: 3 },
  { label: 'Thứ 5', shortLabel: 'T5', dayOfWeek: 4 },
  { label: 'Thứ 6', shortLabel: 'T6', dayOfWeek: 5 },
  { label: 'Thứ 7', shortLabel: 'T7', dayOfWeek: 6 },
  { label: 'Chủ nhật', shortLabel: 'CN', dayOfWeek: 0 },
];

export function ScheduleTable({
  schedules,
  currentWeek,
  onEdit,
  onDelete,
  onCellClick,
}: ScheduleTableProps) {
  // Tính toán các ngày trong tuần (Thứ 2 - Chủ nhật)
  const weekDays = useMemo(() => {
    const monday = new Date(currentWeek);
    // Tìm thứ 2 của tuần hiện tại
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeek]);

  // Nhóm schedules theo ngày
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, Schedule[]> = {};

    schedules.forEach((schedule) => {
      if (!schedule.date) return;

      const scheduleDate = new Date(schedule.date);
      const dateKey = scheduleDate.toISOString().split('T')[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(schedule);
    });

    return grouped;
  }, [schedules]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS_OF_WEEK.map((day, index) => {
            const date = weekDays[index];
            const dateKey = formatDate(date);
            const daySchedules = schedulesByDate[dateKey] || [];

            return (
              <div
                key={day.dayOfWeek}
                className={cn(
                  'text-center p-2 rounded-lg border-2',
                  isToday(date)
                    ? 'bg-orange-100 border-orange-400'
                    : 'bg-gray-50 border-gray-200'
                )}
              >
                <div className="text-xs font-semibold text-gray-600 mb-1">
                  {day.label}
                </div>
                <div
                  className={cn(
                    'text-sm font-bold mb-1',
                    isToday(date) ? 'text-orange-600' : 'text-gray-800'
                  )}
                >
                  {date.getDate()}
                </div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleDateString('vi-VN', { month: 'short' })}
                </div>
                {daySchedules.length > 0 && (
                  <div className="mt-1 text-xs font-semibold text-orange-600">
                    {daySchedules.length} ca
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day, index) => {
            const date = weekDays[index];
            const dateKey = formatDate(date);
            const daySchedules = schedulesByDate[dateKey] || [];

            return (
              <Card
                key={day.dayOfWeek}
                className={cn(
                  'min-h-[200px] p-2 border-2 transition-all duration-200',
                  isToday(date)
                    ? 'bg-orange-50/50 border-orange-200'
                    : 'bg-white border-gray-200 hover:border-orange-300',
                  'cursor-pointer'
                )}
                onClick={() => onCellClick?.(date)}
              >
                {daySchedules.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[180px] text-gray-400 text-xs">
                    Trống
                  </div>
                ) : (
                  <div className="space-y-1">
                    {daySchedules.map((schedule) => (
                      <ScheduleCard
                        key={schedule.id}
                        schedule={schedule}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

