import { cn } from "@/utils/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import * as React from "react";
import { DayPicker } from "react-day-picker";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center h-7",
        caption_label: "text-sm font-semibold text-[#2D1E1A]",
        nav: "flex items-center gap-1",
        button_previous:
          "absolute left-1 inline-flex items-center justify-center rounded-md border border-[#78A243]/30 bg-white p-0 text-[#78A243] hover:bg-[#78A243]/10 hover:border-[#78A243] size-7 transition-colors",
        button_next:
          "absolute right-1 inline-flex items-center justify-center rounded-md border border-[#78A243]/30 bg-white p-0 text-[#78A243] hover:bg-[#78A243]/10 hover:border-[#78A243] size-7 transition-colors",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-[#2D1E1A]/60 rounded-md w-9 font-medium text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative",
        day_button: cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-normal cursor-pointer transition-all duration-200",
          "hover:bg-[#78A243]/20 hover:text-[#2D1E1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78A243]"
        ),
        range_start:
          "day-range-start rounded-l-md bg-[#78A243] text-white hover:bg-[#78A243] hover:text-white",
        range_end:
          "day-range-end rounded-r-md bg-[#78A243] text-white hover:bg-[#78A243] hover:text-white",
        selected:
          "bg-[#78A243] text-white hover:bg-[#78A243] hover:text-white focus:bg-[#78A243] focus:text-white",
        today: "bg-[#EBD187]/50 text-[#2D1E1A] font-semibold",
        outside:
          "text-[#2D1E1A]/30 aria-selected:bg-[#78A243]/30 aria-selected:text-[#2D1E1A]/50",
        disabled: "text-[#2D1E1A]/30 opacity-50 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-[#78A243]/20 aria-selected:text-[#2D1E1A] rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
