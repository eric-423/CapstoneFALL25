'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Schedule } from '@/apis/schedule.api';
import { Plus, ChevronDown, ChevronUp, Eye, X, Search, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScheduleTableProps {
  schedules: Schedule[];
  currentWeek: Date;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  onCellClick?: (date: Date, userId?: number) => void;
}

const DAYS_OF_WEEK = [
  { dayOfWeek: 1, label: 'T2', fullLabel: 'Thứ 2' },
  { dayOfWeek: 2, label: 'T3', fullLabel: 'Thứ 3' },
  { dayOfWeek: 3, label: 'T4', fullLabel: 'Thứ 4' },
  { dayOfWeek: 4, label: 'T5', fullLabel: 'Thứ 5' },
  { dayOfWeek: 5, label: 'T6', fullLabel: 'Thứ 6' },
  { dayOfWeek: 6, label: 'T7', fullLabel: 'Thứ 7' },
  { dayOfWeek: 0, label: 'CN', fullLabel: 'Chủ nhật' },
];

// Determine shift type based on time
type ShiftType = 'morning' | 'afternoon' | 'evening';

const getShiftFromHour = (hour: number): ShiftType => {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

// Determine all shift types a schedule spans
const getShiftTypes = (startTime?: string | null, endTime?: string | null): ShiftType[] => {
  if (!startTime || !endTime) return ['morning'];

  const startHour = parseInt(startTime.split(':')[0] || '8');
  const endHour = parseInt(endTime.split(':')[0] || '17');
  const endMinute = parseInt(endTime.split(':')[1] || '0');

  const shifts: ShiftType[] = [];

  // Morning: starts before 12:00
  if (startHour < 12) {
    shifts.push('morning');
  }

  // Afternoon: starts before 17:00 AND ends after 12:00
  // Or starts between 12:00 and 17:00
  if ((startHour < 17 && endHour > 12) || (startHour >= 12 && startHour < 17)) {
    if (!shifts.includes('afternoon')) shifts.push('afternoon');
  }

  // Evening: starts at 17:00 or later, OR ends after 17:00 (not exactly at 17:00)
  if (startHour >= 17 || endHour > 17 || (endHour === 17 && endMinute > 0)) {
    if (!shifts.includes('evening')) shifts.push('evening');
  }

  // Ensure at least one shift based on start time
  if (shifts.length === 0) {
    shifts.push(getShiftFromHour(startHour));
  }

  return shifts;
};

// Get shift base colors
const SHIFT_COLORS = {
  morning: {
    bg: 'rgb(254 215 170)', // amber-200
    border: 'rgb(245 158 11)', // amber-500
    text: 'text-amber-900',
    tag: 'bg-amber-600',
  },
  afternoon: {
    bg: 'rgb(186 230 253)', // sky-200
    border: 'rgb(14 165 233)', // sky-500
    text: 'text-sky-900',
    tag: 'bg-sky-600',
  },
  evening: {
    bg: 'rgb(221 214 254)', // violet-200
    border: 'rgb(139 92 246)', // violet-500
    text: 'text-violet-900',
    tag: 'bg-violet-600',
  },
};

// Get background color for multi-shift (use first shift color)
const getMultiShiftBg = (shifts: ShiftType[]) => {
  if (shifts.length === 1) {
    return SHIFT_COLORS[shifts[0]].bg;
  }
  // For multi-shift, use a neutral light gray
  return 'rgb(243 244 246)'; // gray-100
};

// Get styles for schedule block (single or multi-shift)
const getScheduleStyles = (shifts: ShiftType[]) => {
  if (shifts.length === 1) {
    const shift = shifts[0];
    return {
      background: SHIFT_COLORS[shift].bg,
      border: SHIFT_COLORS[shift].border,
      textClass: SHIFT_COLORS[shift].text,
      tagClass: SHIFT_COLORS[shift].tag,
    };
  }

  // Multi-shift: use neutral gray background
  return {
    background: 'rgb(243 244 246)', // gray-100
    border: SHIFT_COLORS[shifts[0]].border,
    textClass: 'text-gray-900',
    tagClass: SHIFT_COLORS[shifts[0]].tag,
    isMultiShift: true,
  };
};

const getShiftLabel = (shifts: ShiftType[]) => {
  if (shifts.length === 1) {
    switch (shifts[0]) {
      case 'morning': return 'Sáng';
      case 'afternoon': return 'Chiều';
      case 'evening': return 'Tối';
    }
  }
  return shifts.map(s => {
    switch (s) {
      case 'morning': return 'S';
      case 'afternoon': return 'C';
      case 'evening': return 'T';
    }
  }).join('-');
};

// Format time for display
const formatTime = (time?: string | null) => {
  if (!time) return '';
  return time.slice(0, 5);
};

export function ScheduleTable({
  schedules,
  currentWeek,
  onEdit,
  onCellClick,
}: ScheduleTableProps) {
  const [selectedDayModal, setSelectedDayModal] = useState<{ date: Date; schedules: Schedule[] } | null>(null);
  const [modalSearchName, setModalSearchName] = useState('');
  const [modalFilterShift, setModalFilterShift] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [scrollStates, setScrollStates] = useState<{ [key: string]: { canScrollUp: boolean; canScrollDown: boolean } }>({});

  // Filter schedules in modal
  const filteredModalSchedules = useMemo(() => {
    if (!selectedDayModal) return [];

    return selectedDayModal.schedules.filter((schedule) => {
      // Filter by name
      const matchesName = modalSearchName === '' ||
        (schedule.userName?.toLowerCase().includes(modalSearchName.toLowerCase()));

      // Filter by shift
      if (modalFilterShift === 'all') return matchesName;

      const shifts = getShiftTypes(schedule.startTime, schedule.endTime);
      const matchesShift = shifts.includes(modalFilterShift);

      return matchesName && matchesShift;
    });
  }, [selectedDayModal, modalSearchName, modalFilterShift]);

  // Check scroll states for each column
  const updateScrollState = (dateKey: string, element: HTMLDivElement | null) => {
    if (!element) return;

    const canScrollUp = element.scrollTop > 0;
    const canScrollDown = element.scrollTop < element.scrollHeight - element.clientHeight - 1;

    setScrollStates(prev => ({
      ...prev,
      [dateKey]: { canScrollUp, canScrollDown }
    }));
  };

  // Get week days
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeek]);

  // Group schedules by date
  const schedulesByDate = useMemo(() => {
    const grouped: { [key: string]: Schedule[] } = {};
    schedules.forEach((schedule) => {
      if (schedule.date) {
        // Parse date string and get local date key (YYYY-MM-DD)
        const scheduleDate = new Date(schedule.date);
        const year = scheduleDate.getFullYear();
        const month = String(scheduleDate.getMonth() + 1).padStart(2, '0');
        const day = String(scheduleDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(schedule);
      }
    });
    // Sort schedules by start time
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });
    });
    return grouped;
  }, [schedules]);

  const formatDate = (date: Date) => {
    // Format date as local YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  return (
    <div className="w-full">
      {/* Header - Fixed date row */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {DAYS_OF_WEEK.map((day, index) => {
          const date = weekDays[index];
          const isTodayDate = isToday(date);
          const dateKey = formatDate(date);
          const daySchedules = schedulesByDate[dateKey] || [];
          const hasSchedules = daySchedules.length > 0;

          return (
            <div
              key={day.dayOfWeek}
              className={cn(
                'text-center py-3 px-2 rounded-lg transition-all relative group/header',
                isTodayDate
                  ? 'bg-[#78A243] text-white'
                  : 'bg-gray-100 text-gray-700',
                hasSchedules && 'cursor-pointer hover:ring-2 hover:ring-[#78A243]/50'
              )}
              onClick={() => hasSchedules && setSelectedDayModal({ date, schedules: daySchedules })}
            >
              <div className="text-xs font-bold uppercase tracking-wide">{day.fullLabel}</div>
              <div className={cn(
                'text-lg font-bold mt-0.5',
                isTodayDate ? 'text-white' : 'text-gray-900'
              )}>
                {date.getDate()}/{date.getMonth() + 1}
              </div>

              {/* Badge số lượng và hover xem tất cả */}
              {hasSchedules && (
                <>
                  <div className={cn(
                    'absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    isTodayDate ? 'bg-white text-[#78A243]' : 'bg-[#78A243] text-white'
                  )}>
                    {daySchedules.length}
                  </div>
                  <div className={cn(
                    'absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity',
                    isTodayDate ? 'bg-[#78A243]/90' : 'bg-gray-800/80'
                  )}>
                    <div className="flex items-center gap-1 text-white text-xs font-medium">
                      <Eye className="w-3.5 h-3.5" />
                      Xem tất cả
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule columns */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day, index) => {
          const date = weekDays[index];
          const dateKey = formatDate(date);
          const daySchedules = schedulesByDate[dateKey] || [];
          const isTodayDate = isToday(date);
          const isPast = isPastDate(date);
          const scrollState = scrollStates[dateKey] || { canScrollUp: false, canScrollDown: false };

          return (
            <div
              key={day.dayOfWeek}
              className={cn(
                'relative group rounded-lg border flex flex-col',
                isTodayDate
                  ? 'bg-[#78A243]/5 border-[#78A243]/30'
                  : 'bg-gray-50/50 border-gray-200',
                !isPast && 'hover:border-[#78A243]/50 hover:bg-white transition-all'
              )}
              style={{ height: '420px' }}
            >
              {/* Scroll up indicator - Big centered arrow */}
              {scrollState.canScrollUp && daySchedules.length > 0 && (
                <div
                  className="absolute top-1 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
                  onClick={() => {
                    const el = scrollRefs.current[dateKey];
                    if (el) el.scrollBy({ top: -100, behavior: 'smooth' });
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/90 border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-all">
                    <ChevronUp className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                  </div>
                </div>
              )}

              {/* Schedule blocks with scroll - hidden scrollbar */}
              <div
                ref={(el) => {
                  scrollRefs.current[dateKey] = el;
                  if (el) {
                    // Initial check
                    setTimeout(() => updateScrollState(dateKey, el), 0);
                  }
                }}
                onScroll={(e) => updateScrollState(dateKey, e.currentTarget)}
                className={cn(
                  "p-2 space-y-2 flex-1 overflow-y-auto hide-scrollbar",
                  daySchedules.length === 0 && "flex items-center justify-center"
                )}
                style={{
                  maxHeight: isPast || daySchedules.length === 0 ? '100%' : 'calc(100% - 48px)',
                }}
              >
                {daySchedules.map((schedule) => {
                  const shifts = getShiftTypes(schedule.startTime, schedule.endTime);
                  const styles = getScheduleStyles(shifts);
                  const isMultiShift = shifts.length > 1;

                  return (
                    <div
                      key={schedule.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(schedule);
                      }}
                      className={cn(
                        'rounded-lg border-l-4 cursor-pointer transition-all hover:translate-x-0.5 overflow-hidden bg-white',
                        isPast && 'opacity-60'
                      )}
                      style={{
                        borderLeftColor: styles.border,
                      }}
                    >
                      {/* Content */}
                      <div
                        className="p-2 border border-l-0 rounded-r-lg"
                        style={{
                          background: styles.background,
                          borderColor: styles.border
                        }}
                      >
                        {/* User name */}
                        <div className={cn('font-bold text-xs truncate', isMultiShift ? 'text-gray-900' : styles.textClass)}>
                          {schedule.userName || 'Nhân viên'}
                        </div>

                        {/* Time */}
                        <div className="text-[10px] text-gray-500 mt-0.5 font-medium">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>

                        {/* Shift tags - compact */}
                        <div className="flex gap-0.5 mt-1 flex-wrap">
                          {shifts.map((shift, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                'px-1.5 py-0.5 rounded text-[9px] font-semibold text-white',
                                shift === 'morning' && 'bg-amber-600',
                                shift === 'afternoon' && 'bg-sky-600',
                                shift === 'evening' && 'bg-violet-600'
                              )}
                            >
                              {shift === 'morning' ? 'S' : shift === 'afternoon' ? 'C' : 'T'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty state with add button */}
                {daySchedules.length === 0 && !isPast && (
                  <div
                    className="flex flex-col items-center justify-center text-gray-400 cursor-pointer"
                    onClick={() => onCellClick?.(date)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-[#78A243]/10 transition-colors">
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#78A243] transition-colors" />
                    </div>
                    <span className="text-xs font-medium group-hover:text-[#78A243] transition-colors">Thêm lịch</span>
                  </div>
                )}

                {/* Empty state for past dates */}
                {daySchedules.length === 0 && isPast && (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <span className="text-xs">Trống</span>
                  </div>
                )}
              </div>

              {/* Scroll down indicator - Big centered arrow */}
              {scrollState.canScrollDown && daySchedules.length > 0 && (
                <div
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
                  onClick={() => {
                    const el = scrollRefs.current[dateKey];
                    if (el) el.scrollBy({ top: 100, behavior: 'smooth' });
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/90 border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-all">
                    <ChevronDown className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                  </div>
                </div>
              )}

              {/* Floating add button - show when has schedules */}
              {!isPast && daySchedules.length > 0 && (
                <div className="p-2 border-t border-dashed border-gray-200 group-hover:border-[#78A243]/30 transition-colors">
                  <button
                    className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-[#78A243] text-gray-500 hover:text-white text-xs font-semibold transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCellClick?.(date);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-600"></div>
          <span className="text-xs text-gray-600 font-medium">Ca sáng (trước 12h)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-600"></div>
          <span className="text-xs text-gray-600 font-medium">Ca chiều (12h-17h)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-600"></div>
          <span className="text-xs text-gray-600 font-medium">Ca tối (sau 17h)</span>
        </div>
      </div>

      {/* Day Detail Modal - ProductForm Style */}
      <Dialog open={!!selectedDayModal} onOpenChange={(open) => {
        if (!open) {
          setSelectedDayModal(null);
          setModalSearchName('');
          setModalFilterShift('all');
        }
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-white border-0 shadow-xl rounded-2xl [&>button]:hidden">
          {/* Header */}
          <div className="bg-[#78A243] p-5 flex items-center justify-between shrink-0 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-white">
                {selectedDayModal && (
                  <>
                    Lịch trình ngày {selectedDayModal.date.getDate()}/{selectedDayModal.date.getMonth() + 1}/{selectedDayModal.date.getFullYear()}
                  </>
                )}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-3">
              {selectedDayModal && (
                <div className="bg-white/20 rounded-lg px-3 py-1.5">
                  <span className="text-white text-sm font-medium">
                    {filteredModalSchedules.length}/{selectedDayModal.schedules.length} lịch trình
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedDayModal(null)}
                className="w-8 h-8 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          {/* Filter section */}
          <div className="px-5 py-4 border-b bg-gray-50 flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên nhân viên..."
                value={modalSearchName}
                onChange={(e) => setModalSearchName(e.target.value)}
                className="pl-9 h-10 text-sm bg-white border-gray-200 focus:border-[#78A243] focus:ring-[#78A243]/20"
              />
            </div>
            <Select value={modalFilterShift} onValueChange={(v) => setModalFilterShift(v as typeof modalFilterShift)}>
              <SelectTrigger className="w-[140px] h-10 bg-white border-gray-200 focus:border-[#78A243] focus:ring-[#78A243]/20">
                <SelectValue placeholder="Tất cả ca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ca</SelectItem>
                <SelectItem value="morning">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Ca sáng
                  </span>
                </SelectItem>
                <SelectItem value="afternoon">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    Ca chiều
                  </span>
                </SelectItem>
                <SelectItem value="evening">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                    Ca tối
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {(modalSearchName || modalFilterShift !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3 text-gray-500 hover:text-gray-700 border-gray-200"
                onClick={() => {
                  setModalSearchName('');
                  setModalFilterShift('all');
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Xóa
              </Button>
            )}
          </div>

          {/* Schedule list */}
          <div className="flex-1 overflow-y-auto p-5 bg-white">
            {filteredModalSchedules.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Không tìm thấy lịch trình phù hợp</p>
                <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc tìm kiếm</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredModalSchedules.map((schedule) => {
                  const shifts = getShiftTypes(schedule.startTime, schedule.endTime);
                  const styles = getScheduleStyles(shifts);

                  return (
                    <div
                      key={schedule.id}
                      onClick={() => {
                        setSelectedDayModal(null);
                        setModalSearchName('');
                        setModalFilterShift('all');
                        onEdit?.(schedule);
                      }}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:border-[#78A243] hover:bg-gray-50"
                    >
                      <div className="flex">
                        {/* Left color bar */}
                        <div
                          className="w-1.5 shrink-0"
                          style={{ background: styles.border }}
                        />

                        {/* Content */}
                        <div className="flex-1 p-3 flex items-center gap-3">
                          {/* Avatar */}
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: styles.background }}
                          >
                            <span className={cn('text-base font-bold', styles.textClass)}>
                              {(schedule.userName || 'N')[0].toUpperCase()}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate text-sm">
                              {schedule.userName || 'Nhân viên'}
                            </div>
                            {schedule.name && (
                              <div className="text-xs text-gray-500 truncate">
                                {schedule.name}
                              </div>
                            )}
                          </div>

                          {/* Time and shifts */}
                          <div className="text-right shrink-0">
                            <div className="text-sm text-gray-700 font-medium">
                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </div>
                            <div className="flex gap-1 mt-1 justify-end">
                              {shifts.map((shift, idx) => (
                                <span
                                  key={idx}
                                  className={cn(
                                    'px-2 py-0.5 rounded text-xs font-medium text-white',
                                    shift === 'morning' && 'bg-amber-500',
                                    shift === 'afternoon' && 'bg-sky-500',
                                    shift === 'evening' && 'bg-violet-500'
                                  )}
                                >
                                  {shift === 'morning' ? 'S' : shift === 'afternoon' ? 'C' : 'T'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0 rounded-b-2xl flex gap-3 justify-between items-center">
            <div className="text-sm text-gray-500">
              {(modalSearchName || modalFilterShift !== 'all') ? (
                <>Hiển thị <span className="font-medium text-gray-700">{filteredModalSchedules.length}</span> / {selectedDayModal?.schedules.length}</>
              ) : (
                <>Tổng: <span className="font-medium text-gray-700">{selectedDayModal?.schedules.length}</span> lịch trình</>
              )}
            </div>

            {selectedDayModal && !isPastDate(selectedDayModal.date) && (
              <Button
                onClick={() => {
                  const date = selectedDayModal.date;
                  setSelectedDayModal(null);
                  setModalSearchName('');
                  setModalFilterShift('all');
                  onCellClick?.(date);
                }}
                className="px-4 py-2 bg-[#78A243] hover:bg-[#78A243]/90 text-white font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm lịch trình
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
