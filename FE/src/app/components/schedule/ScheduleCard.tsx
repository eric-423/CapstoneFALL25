'use client';

import React from 'react';
import { User, X, Clock, Edit2 } from 'lucide-react';
import { Schedule } from '@/apis/schedule.api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/lib/utils';

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  className?: string;
}

export function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
  className,
}: ScheduleCardProps) {
  const formatTime = (time: string | null) => {
    if (!time) return 'N/A';
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const isPastSchedule = () => {
    if (!schedule.date) return false;

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
      return now > endTime;
    }

    return false;
  };

  const isPast = isPastSchedule();

  return (
    <Card
      className={cn(
        'p-2 sm:p-3 border transition-all duration-200 relative group',
        isPast
          ? 'bg-gray-100 border-gray-300 opacity-70 cursor-not-allowed'
          : 'bg-gradient-to-br from-white to-orange-50/40 border-orange-200 hover:border-orange-400 hover:shadow-lg cursor-pointer',
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!isPast) {
          onEdit?.(schedule);
        }
      }}
    >
      {!isPast && (
        <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="bg-orange-500 text-white rounded-full p-0.5 sm:p-1">
            <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-1.5 sm:gap-2 pr-5 sm:pr-6">
        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={cn(
                'w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0',
                isPast ? 'bg-gray-200' : 'bg-orange-100',
              )}
            >
              <User
                className={cn(
                  'w-3 h-3 sm:w-3.5 sm:h-3.5',
                  isPast ? 'text-gray-500' : 'text-orange-600',
                )}
              />
            </div>
            <h4
              className={cn(
                'font-bold text-xs sm:text-sm truncate',
                isPast ? 'text-gray-500' : 'text-gray-900',
              )}
            >
              {schedule.userName}
            </h4>
          </div>

          <div
            className={cn(
              'rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1',
              isPast ? 'bg-gray-200' : 'bg-orange-100/50',
            )}
          >
            <p
              className={cn(
                'text-[10px] sm:text-xs font-semibold truncate',
                isPast ? 'text-gray-600' : 'text-orange-900',
              )}
            >
              {schedule.name}
            </p>
          </div>

          {(schedule.startTime || schedule.endTime) && (
            <div
              className={cn(
                'flex items-center gap-1 text-[10px] sm:text-xs rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1',
                isPast ? 'bg-gray-200 text-gray-600' : 'text-gray-700 bg-gray-50',
              )}
            >
              <Clock
                className={cn(
                  'w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0',
                  isPast ? 'text-gray-400' : 'text-gray-500',
                )}
              />
              <span className="font-medium truncate">
                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
              </span>
            </div>
          )}

          {schedule.description && (
            <p
              className={cn(
                'text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed hidden sm:block',
                isPast ? 'text-gray-500' : 'text-gray-600',
              )}
            >
              {schedule.description}
            </p>
          )}
        </div>

        {onDelete && !isPast && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 sm:h-7 sm:w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-red-50 hover:text-red-600 absolute top-1.5 sm:top-2 right-1.5 sm:right-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(schedule);
            }}
            title="Xóa lịch trình"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}









