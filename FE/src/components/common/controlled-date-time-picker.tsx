import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/utils/lib/utils';
import { getReceiveTime } from '@/utils/getReceiveTime';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { FormControl } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const HOUR_OPTIONS = [11, 12] as const;
const DEFAULT_MINUTE_OPTIONS: number[] = [0, 15, 30];
const LATE_MINUTE_OPTIONS: number[] = [30, 45];

interface ControlledDateTimePickerProps {
  value?: Date | string | number | null;
  onChange?: (date: Date | undefined) => void;
}

const ControlledDateTimePicker = ({ value, onChange }: ControlledDateTimePickerProps) => {
  const selectedDate = useMemo(() => {
    if (value === undefined || value === null) return undefined;
    if (value instanceof Date) return value;

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  }, [value]);

  const selectedHour = selectedDate?.getHours();
  const [minuteOptions, setMinuteOptions] = useState<number[]>(DEFAULT_MINUTE_OPTIONS);

  useEffect(() => {
    const nextOptions = selectedHour === 11 ? LATE_MINUTE_OPTIONS : DEFAULT_MINUTE_OPTIONS;
    setMinuteOptions((prev) => (prev === nextOptions ? prev : nextOptions));
  }, [selectedHour]);

  const ensureBaseDate = () => (selectedDate ? new Date(selectedDate) : new Date(getReceiveTime()));

  const handleDaySelect = (date: Date | undefined) => {
    if (!onChange) return;

    if (!date) {
      onChange(undefined);
      return;
    }

    const next = new Date(date);
    next.setHours(12, 0, 0, 0);
    setMinuteOptions(DEFAULT_MINUTE_OPTIONS);
    onChange(next);
  };

  const handleHourClick = (hour: number) => {
    if (!onChange) return;

    const baseDate = ensureBaseDate();
    let minute = baseDate.getMinutes();

    if (hour === 11) {
      minute = minute < 30 ? 30 : minute > 45 ? 45 : minute;
    } else {
      minute = minute > 30 ? 30 : minute;
      if (minute < 0) minute = 0;
    }

    baseDate.setHours(hour, minute, 0, 0);
    setMinuteOptions(hour === 11 ? LATE_MINUTE_OPTIONS : DEFAULT_MINUTE_OPTIONS);
    onChange(baseDate);
  };

  const handleMinuteClick = (minute: number) => {
    if (!onChange) return;

    const baseDate = ensureBaseDate();
    baseDate.setMinutes(minute, 0, 0);
    onChange(baseDate);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant='outline'
              className={cn(
                'w-full pl-3 text-left font-normal rounded-xl hover:bg-secondary',
                !selectedDate && 'text-muted-foreground',
              )}
              type='button'
            >
              {selectedDate ? (
                `${selectedDate.toLocaleDateString('vi-VN', { weekday: 'long' })}, ${format(selectedDate, 'dd/MM/yyyy - HH:mm')}`
              ) : (
                <span>Chọn ngày</span>
              )}
              <CalendarIcon className='ml-auto h-4 w-4 text-foreground/70' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <div className='sm:flex'>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={handleDaySelect}
              initialFocus
              today={undefined}
              disabled={(date) => date < new Date(getReceiveTime().setHours(0, 0, 0, 0))}
            />
            <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
              <ScrollArea className='w-64 sm:w-auto'>
                <div className='flex sm:flex-col p-2'>
                  {HOUR_OPTIONS.map((hour) => (
                    <Button
                      key={hour}
                      size='icon'
                      variant={selectedDate && selectedDate.getHours() === hour ? 'default' : 'ghost'}
                      className='sm:w-full shrink-0 aspect-square'
                      onClick={() => handleHourClick(hour)}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation='horizontal' className='sm:hidden' />
              </ScrollArea>
              <ScrollArea className='w-64 sm:w-auto'>
                <div className='flex sm:flex-col p-2'>
                  {minuteOptions.map((minute) => (
                    <Button
                      key={minute}
                      size='icon'
                      variant={selectedDate && selectedDate.getMinutes() === minute ? 'default' : 'ghost'}
                      className='sm:w-full shrink-0 aspect-square'
                      onClick={() => handleMinuteClick(minute)}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation='horizontal' className='sm:hidden' />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ControlledDateTimePicker;
