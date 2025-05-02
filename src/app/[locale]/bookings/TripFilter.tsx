"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatTime, normalizeTimeInput } from "@/lib/utils/TimeConverter";
import { BusType, TripOrderBy } from "@/services/API/tripAPI";
import { ChevronRight, FilterIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type TimeRange = {
  label: string;
  from: string;
  to: string;
};

export type TripFilterType = {
  "departureTime.fromTime": string;
  "departureTime.toTime": string;
  busType: BusType[];
  orderBy: TripOrderBy[];
};

export default function TripFilter({
  filter,
  setFilter,
}: {
  filter: TripFilterType;
  setFilter: React.Dispatch<React.SetStateAction<TripFilterType>>;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const t = useTranslations();
  const TIME_OPTIONS: TimeRange[] = [
    { label: `${t("morning")} (06:00 - 12:00)`, from: "06:00", to: "12:00" },
    { label: `${t("afternoon")} (12:00 - 18:00)`, from: "12:00", to: "18:00" },
    { label: `${t("evening")} (18:00 - 24:00)`, from: "18:00", to: "23:59" },
    { label: `${t("night")} (00:00 - 06:00)`, from: "00:00", to: "06:00" },
  ];

  const toggleBusType = (type: BusType) => {
    setFilter((prev: TripFilterType) => ({
      ...prev,
      busType: prev.busType.includes(type)
        ? prev.busType.filter((t) => t !== type)
        : [...prev.busType, type],
    }));
  };

  const toggleOrderBy = (order: TripOrderBy) => {
    setFilter((prev: TripFilterType) => ({
      ...prev,
      orderBy: prev.orderBy.includes(order)
        ? prev.orderBy.filter((o) => o !== order)
        : [...prev.orderBy, order],
    }));
  };

  const handleTimeChange = (value: string) => {
    const [from, to] = value.split("-");
    setFilter((prev: TripFilterType) => ({
      ...prev,
      "departureTime.fromTime": normalizeTimeInput(from),
      "departureTime.toTime": normalizeTimeInput(to),
    }));
  };

  return (
    <div>
      {/* Filters */}
      <Card
        className={`sticky top-4 hidden md:block ${showFilters ? "block" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">{t("searchFilter")}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilter({
                  "departureTime.fromTime": "",
                  "departureTime.toTime": "",
                  busType: [],
                  orderBy: [],
                })
              }
              className="text-red-500"
            >
              <TrashIcon className="w-4 h-4" />
              {t("deleteFilter")}
            </Button>
          </div>

          {/* Bus Type */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">
              {t("busTypeTitle")}
            </Label>
            <div className="space-y-2">
              {Object.values(BusType).map((type) => (
                <div className="flex items-center" key={type}>
                  <Checkbox
                    id={type}
                    checked={filter.busType.includes(type)}
                    onCheckedChange={() => toggleBusType(type)}
                  />
                  <Label htmlFor={type} className="ml-2">
                    {t(`busType.${type}`)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Time (only 1 allowed) */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">
              {t("departureTime")}
            </Label>
            <RadioGroup
              value={`${formatTime(
                filter["departureTime.fromTime"]
              )}-${formatTime(filter["departureTime.toTime"])}`}
              onValueChange={handleTimeChange}
              className="space-y-2"
            >
              {TIME_OPTIONS.map((range) => (
                <div className="flex items-center" key={range.label}>
                  <RadioGroupItem
                    value={`${range.from}-${range.to}`}
                    id={range.label}
                  />
                  <Label htmlFor={range.label} className="ml-2">
                    {range.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Order By */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">
              {t("orderBy")}
            </Label>
            <div className="flex gap-2">
              <Button
                variant={
                  filter.orderBy.includes(TripOrderBy.PRICE)
                    ? "default"
                    : "outline"
                }
                onClick={() => toggleOrderBy(TripOrderBy.PRICE)}
              >
                {t("price")}
              </Button>
              <Button
                variant={
                  filter.orderBy.includes(TripOrderBy.DEPARTURE_TIME)
                    ? "default"
                    : "outline"
                }
                onClick={() => toggleOrderBy(TripOrderBy.DEPARTURE_TIME)}
              >
                {t("departureTime")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Filters */}
      <div className="lg:col-span-3">
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full flex justify-between items-center "
          >
            <span className="flex items-center">
              <FilterIcon className="h-4 w-4 mr-2" />
              Lọc kết quả
            </span>
            <ChevronRight
              className={`h-4 w-4 transform transition-transform ${
                showFilters ? "rotate-90" : ""
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
