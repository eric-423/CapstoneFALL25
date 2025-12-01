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

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  return (
    <div className="w-full overflow-x-auto -mx-2 sm:mx-0">
      <div className="min-w-[600px] sm:min-w-[800px] px-2 sm:px-0">
        {/* Header - Cải thiện visual và responsive */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-3 sm:mb-4">
          {DAYS_OF_WEEK.map((day, index) => {
            const date = weekDays[index];
            const dateKey = formatDate(date);
            const daySchedules = schedulesByDate[dateKey] || [];
            const isTodayDate = isToday(date);
            const isPast = isPastDate(date);

            return (
              <div
                key={day.dayOfWeek}
                className={cn(
                  'text-center p-1.5 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all',
                  isPast
                    ? 'bg-gray-100 border-gray-300 opacity-60'
                    : isTodayDate
                    ? 'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-400 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                )}
              >
                <div className={cn(
                  'text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1.5',
                  isPast 
                    ? 'text-gray-400' 
                    : isTodayDate 
                    ? 'text-orange-700' 
                    : 'text-gray-600'
                )}>
                  <span className="hidden sm:inline">{day.label}</span>
                  <span className="sm:hidden">{day.shortLabel}</span>
                </div>
                <div
                  className={cn(
                    'text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1',
                    isPast
                      ? 'text-gray-400'
                      : isTodayDate 
                      ? 'text-orange-600' 
                      : 'text-gray-800'
                  )}
                >
                  {date.getDate()}
                </div>
                <div className={cn(
                  'text-[10px] sm:text-xs mb-1 sm:mb-2 hidden sm:block',
                  isPast
                    ? 'text-gray-400'
                    : isTodayDate 
                    ? 'text-orange-600 font-medium' 
                    : 'text-gray-500'
                )}>
                  {date.toLocaleDateString('vi-VN', { month: 'short' })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {DAYS_OF_WEEK.map((day, index) => {
            const date = weekDays[index];
            const dateKey = formatDate(date);
            const daySchedules = schedulesByDate[dateKey] || [];
            const isTodayDate = isToday(date);
            const isPast = isPastDate(date);

            return (
              <Card
                key={day.dayOfWeek}
                className={cn(
                  'min-h-[150px] sm:min-h-[250px] p-1.5 sm:p-3 border-2 transition-all duration-200 relative group',
                  isPast
                    ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                    : isTodayDate
                    ? 'bg-orange-50/30 border-orange-200 cursor-pointer'
                    : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md cursor-pointer'
                )}
                onClick={() => {
                  if (!isPast) {
                    onCellClick?.(date);
                  }
                }}
              >
                {daySchedules.length === 0 ? (
                  isPast ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[130px] sm:min-h-[220px]">
                      {/* Không hiển thị gì cho ngày quá khứ trống */}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[130px] sm:min-h-[220px] text-gray-400">
                      <div className="text-2xl sm:text-4xl mb-1 sm:mb-2 opacity-30">+</div>
                      <div className="text-[10px] sm:text-xs font-medium text-center px-1">Click để thêm</div>
                      <div className="text-[9px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1 hidden sm:block">Hoặc kéo thả vào đây</div>
                    </div>
                  )
                ) : (
                  <div className="space-y-1 sm:space-y-2">
                    {daySchedules.map((schedule) => (
                      <ScheduleCard
                        key={schedule.id}
                        schedule={schedule}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                    {!isPast && (
                      <div 
                        className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-dashed border-gray-200 cursor-pointer hover:bg-orange-50/50 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCellClick?.(date);
                        }}
                      >
                        <div className="text-[10px] sm:text-xs text-center text-gray-400 group-hover:text-orange-500 transition-colors">
                          + Thêm ca
                        </div>
                      </div>
                    )}
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


