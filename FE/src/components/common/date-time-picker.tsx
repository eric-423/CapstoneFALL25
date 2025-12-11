import { useMemo } from "react";

import { cn } from "@/utils/lib/utils";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { FormControl } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ControlledDateTimePickerProps {
  value?: Date | string | number | null;
  onChange?: (date: Date | undefined) => void;
}

const ControlledDateTimePicker = ({
  value,
  onChange,
}: ControlledDateTimePickerProps) => {
  const selectedDate = useMemo(() => {
    if (value === undefined || value === null) return undefined;
    if (value instanceof Date) return value;

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  }, [value]);

  const ensureBaseDate = () =>
    selectedDate ? new Date(selectedDate) : new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const clampToMin = (date: Date) => {
    const now = new Date();
    return date < now ? now : date;
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!onChange) return;

    if (!date) {
      onChange(undefined);
      return;
    }

    const next = new Date(date);
    const now = new Date();

    if (isSameDay(next, now)) {
      next.setHours(now.getHours(), now.getMinutes(), 0, 0);
    } else {
      const base = selectedDate ?? now;
      next.setHours(base.getHours() || 12, base.getMinutes() || 0, 0, 0);
    }
    onChange(clampToMin(next));
  };
  const handleHourChange = (hour: number) => {
    if (!onChange) return;
    const baseDate = ensureBaseDate();
    baseDate.setHours(hour, baseDate.getMinutes() || 0, 0, 0);
    onChange(clampToMin(baseDate));
  };

  const handleMinuteChange = (minute: number) => {
    if (!onChange) return;
    const baseDate = ensureBaseDate();
    baseDate.setMinutes(minute, 0, 0);
    onChange(clampToMin(baseDate));
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal rounded-xl hover:bg-secondary justify-start",
                !selectedDate && "text-muted-foreground"
              )}
              type="button"
            >
              {selectedDate ? (
                `${selectedDate.toLocaleDateString("vi-VN", { weekday: "long" })}, ${format(selectedDate, "dd/MM/yyyy - HH:mm")}`
              ) : (
                <span>Chọn ngày</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 text-foreground/70" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="w-[320px] sm:w-auto p-0 rounded-2xl border shadow-lg"
          style={{ backgroundColor: "#FFFCF7" }}
        >
          <div className="flex flex-col sm:flex-row">
            <div className="p-3 border-b sm:border-b-0 sm:border-r [&_.rdp-head_row]:hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDaySelect}
                today={undefined}
                locale={vi}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
              />
            </div>
            <div className="flex flex-col gap-2 p-3 sm:w-56">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Giờ giao hàng
                </p>
                <select
                  title="Giờ giao hàng"
                  className="w-full rounded-xl border bg-[#FFFCF7] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={selectedDate?.getHours() ?? ""}
                  onChange={(e) => handleHourChange(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Chọn giờ
                  </option>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, "0")} giờ
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Phút
                </p>
                <select
                  title="Phút"

                  className="w-full rounded-xl border bg-[#FFFCF7] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={selectedDate?.getMinutes() ?? ""}
                  onChange={(e) => handleMinuteChange(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Chọn phút
                  </option>
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, "0")} phút
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ControlledDateTimePicker;
