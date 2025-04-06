"use client";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

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

  useEffect(() => {
    if (value) {
      const selectedItem = options.find((opt) => opt.value === value);
      if (selectedItem) {
        setSearchQuery(selectedItem.label);
      }
    } else {
      setSearchQuery("");
    }
  }, [value, options]);

  const filteredOptions = useMemo(() => {
    const searchQueryLowerCase = searchQuery.trim().toLowerCase();
    return searchQueryLowerCase
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchQueryLowerCase)
        )
      : options;
  }, [searchQuery, options]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, onChange]);

  const handleSearchChange = (input: string) => {
    setSearchQuery(input);
  };

  const handleClearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    onChange("");
  };

  const handleSelectOption = (optionValue: string) => {
    const selectedOption = options.find((opt) => opt.value === optionValue);
    if (selectedOption) {
      onChange(selectedOption.value);
      setSearchQuery(selectedOption.label);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          onClick={() => setOpen(true)}
        >
          {value ? searchQuery : placeholder || "Select"}
          {searchQuery && (
            <X
              className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
              onClick={handleClearInput}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <Command>
          <CommandInput
            placeholder="Search..."
            value={searchQuery}
            onValueChange={handleSearchChange}
            className="h-9"
            autoFocus
          />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelectOption(option.value)}
                  className="flex items-center cursor-pointer p-2"
                >
                  {option.label}
                  {value === option.value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))
            ) : (
              <div className="py-2 px-2 text-sm">No results found</div>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
