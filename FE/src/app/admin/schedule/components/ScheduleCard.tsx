'use client';

import React from 'react';
import { User, X } from 'lucide-react';
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

  return (
    <Card
      className={cn(
        'p-3 mb-2 bg-gradient-to-br from-white to-orange-50/30 border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer group',
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onEdit?.(schedule);
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className='flex items-center gap-2'>
            <User className="w-3 h-3 flex-shrink-0" />
            <h4 className="font-semibold text-sm text-gray-800 truncate mb-1">
              {schedule.userName}
            </h4>
          </div>


          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <span className="truncate">{schedule.name}</span>
          </div>

          {(schedule.startTime || schedule.endTime) && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>
                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
              </span>
            </div>
          )}

          {schedule.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {schedule.description}
            </p>
          )}
        </div>


        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(schedule);
            }}
          >
            <X className="w-3 h-3 text-red-500" />
          </Button>
        )}
      </div>
    </Card>
  );
}

