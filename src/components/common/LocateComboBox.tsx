"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils/TimeConverter";
import { TripTransit } from "@/services/API/tripAPI";
import { useTranslations } from "next-intl";

export function LocateCombobox({
  data,
  defaultValue,
  onValueChange,
}: {
  data: TripTransit[];
  defaultValue?: TripTransit;
  onValueChange: (value: string) => void;
}) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(
    defaultValue?.transitPointId || data[0].transitPointId
  );

  const findSelected = React.useMemo(
    () => data.find((sub) => sub.transitPointId === value),
    [data, value]
  );

  React.useEffect(() => {
    if (defaultValue) onValueChange(defaultValue.transitPointId);
  }, [defaultValue, onValueChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? `${formatTime(findSelected?.arrivalTime || "")} - ${
                findSelected?.transitPoint.name
              }`
            : t("search")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[500px] p-0">
        <Command className="">
          <CommandInput placeholder={t("search")} />
          <CommandList>
            <CommandEmpty>{t("common.nodata")}</CommandEmpty>
            <CommandGroup>
              {data.map((sub) => (
                <CommandItem
                  key={sub.transitPointId}
                  value={sub.transitPoint.name.toLowerCase()}
                  onSelect={() => {
                    setValue(sub.transitPointId);
                    onValueChange(sub.transitPointId);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-5 w-5 text-primary font-bold",
                      value === sub.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex justify-between w-full">
                    <div className="flex gap-3">
                      <p className="font-bold text-primary">
                        {formatTime(sub.arrivalTime)}
                      </p>
                      <div className="flex flex-col">
                        <p className="font-bold">{sub.transitPoint.name}</p>
                        <p>{sub.transitPoint.address}</p>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs underline cursor-pointer hover:bg-primary/10"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps/search/${sub.transitPoint.address}`,
                          "_blank"
                        );
                      }}
                    >
                      Xem vị trí
                    </Button>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
