import { cn } from "@/utils/lib/utils";

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
        nav: "flex items-center gap-1",
        nav_button:
          "inline-flex items-center justify-center rounded-md border bg-transparent p-0 text-xs text-foreground/70 hover:bg-accent hover:text-foreground size-7 opacity-60 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "",
        head_cell: "",
        weekdays: "hidden",
        weekday: "hidden",
        row: "",
        cell: cn(
          "h-8 w-8 text-center align-middle text-sm p-0",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : ""
        ),
        day: "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-normal cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{} as React.ComponentProps<typeof DayPicker>["components"]}
      {...props}
    />
  );
}

export { Calendar };
