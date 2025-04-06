"use client";

import { Check, X } from "lucide-react";
import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value) {
      const selectedItem = options.find((opt) => opt.value === value);
      if (selectedItem) {
        setSearchQuery(selectedItem.label);
      }
    }
  }, [value, options]);

  const filteredOptions = searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(value);
    }, 500);
  };

  const handleClearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    onChange("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value ? value : placeholder || "Select"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 max-h-72 overflow-y-auto">
        <Command>
          <div className="relative">
            <CommandInput
              className="p-4 pr-10"
              value={searchQuery || ""}
              onVolumeChange={handleSearchChange}
              placeholder="Search..."
            />
            {searchQuery && (
              <button
                onClick={handleClearInput}
                className="absolute right-2 top-2 text-muted"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option.value);
                  setSearchQuery(option.label);
                  setOpen(false);
                }}
                className={cn("p-2 cursor-pointer flex items-center ", "")}
              >
                {option.label}
                {/* <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                /> */}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
