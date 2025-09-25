import { cn } from '@/lib/utils';
import { getReceiveTime } from '@/utils/getReceiveTime';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { FormControl } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface ControlledDateTimePickerProps {
  field: Date;
  handleDateSelect?: (date: Date | undefined) => void;
  handleTimeChange: (type: 'hour' | 'minute', value: string) => void;
  timeRestriction?: number[];
}

const ControlledDateTimePicker = ({
  field,
  handleDateSelect,
  handleTimeChange,
  timeRestriction,
}: ControlledDateTimePickerProps) => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <FormControl>
            <Button
              variant='outline'
              className={cn(
                'w-full pl-3 text-left font-normal rounded-xl  hover:bg-secondary  ',
                !field && 'text-muted-foreground',
              )}
              type='button'
            >
              {field ? (
                `${field.toLocaleDateString('vi-VN', { weekday: 'long' })}, ${format(field, 'dd/MM/yyyy - HH:mm')}`
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
              selected={field}
              onSelect={handleDateSelect}
              initialFocus
              today={undefined}
              disabled={(date) => date < new Date(getReceiveTime().setHours(0, 0, 0, 0))}
            />
            <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
              <ScrollArea className='w-64 sm:w-auto'>
                <div className='flex sm:flex-col p-2'>
                  {Array.from({ length: 2 }, (_, i) => 12 - i)
                    .reverse()
                    .map((hour) => (
                      <Button
                        key={hour}
                        size='icon'
                        variant={field && field.getHours() === hour ? 'default' : 'ghost'}
                        className='sm:w-full shrink-0 aspect-square'
                        onClick={() => handleTimeChange('hour', hour.toString())}
                      >
                        {hour}
                      </Button>
                    ))}
                </div>
                <ScrollBar orientation='horizontal' className='sm:hidden' />
              </ScrollArea>
              <ScrollArea className='w-64 sm:w-auto'>
                <div className='flex sm:flex-col p-2'>
                  {Array.from({ length: timeRestriction?.length ?? 2 }, (_, i) =>
                    timeRestriction ? timeRestriction[i] : i * 30,
                  ).map((minute) => (
                    <Button
                      key={minute}
                      size='icon'
                      variant={field && field.getMinutes() === minute ? 'default' : 'ghost'}
                      className='sm:w-full shrink-0 aspect-square'
                      onClick={() => handleTimeChange('minute', minute.toString())}
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
