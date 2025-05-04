"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

interface DatePickerProps {
  value: string | undefined;
  onChange: (date: string | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  className,
  placeholder,
}: DatePickerProps) {
  const t = useTranslations();

  const handleClearDate = () => {
    onChange(undefined); // Gọi onChange khi xóa ngày
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Chuyển đổi ngày thành định dạng "yyyy-MM-dd"
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild className="w-fit">
          <Button
            variant={"outline"}
            className={cn(
              "justify-between text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {value ? (
              <Fragment>
                {value} {/* Hiển thị ngày theo định dạng yyyy-MM-dd */}
                <div
                  className="ml-2 text-red-500 cursor-pointer"
                  onClick={handleClearDate}
                >
                  <XIcon className="h-4 w-4" />
                </div>
              </Fragment>
            ) : (
              <span>{placeholder || t("select-date")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ? parseISO(value) : undefined} // Chuyển đổi từ string thành Date khi cần
            onSelect={handleDateSelect} // Chuyển đổi ngày và gọi onChange khi chọn
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
