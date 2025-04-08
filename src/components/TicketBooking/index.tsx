"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { ArrowRightLeft, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "../ui/combobox";

const southernVietnamCities = [
  { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Vũng Tàu", label: "Vũng Tàu" },
  { value: "Bến Tre", label: "Bến Tre" },
  { value: "Cà Mau", label: "Cà Mau" },
  { value: "An Giang", label: "An Giang" },
  { value: "Bạc Liêu", label: "Bạc Liêu" },
  { value: "Kiên Giang", label: "Kiên Giang" },
  { value: "Long An", label: "Long An" },
  { value: "Đồng Tháp", label: "Đồng Tháp" },
  { value: "Trà Vinh", label: "Trà Vinh" },
  { value: "Sóc Trăng", label: "Sóc Trăng" },
  { value: "Bình Phước", label: "Bình Phước" },
  { value: "Tây Ninh", label: "Tây Ninh" },
  { value: "Đồng Nai", label: "Đồng Nai" },
  { value: "Tiền Giang", label: "Tiền Giang" },
  { value: "Bình Dương", label: "Bình Dương" },
  { value: "Vĩnh Long", label: "Vĩnh Long" },
  { value: "Hậu Giang", label: "Hậu Giang" },
  { value: "ANMINH", label: "ANMINH" },
];

const TicketBookingPage = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation("common");
  const currentLocale = i18n.language === "vi" ? vi : enUS;
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    new Date()
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [tickets, setTickets] = useState("1");
  const [recentSearches, setRecentSearches] = useState([
    {
      origin: "TP. Hồ Chí Minh",
      destination: "ANMINH",
      date: new Date(),
    },
  ]);

  const handleSearch = () => {
    const newSearch = {
      origin,
      destination,
      date: departureDate || new Date(),
    };

    setRecentSearches([newSearch, ...recentSearches.slice(0, 2)]);
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className={cn("mx-auto", className)}>
      <div className="relative hidden lg:block mb-10 h-[250px] w-full cursor-pointer rounded-xl object-cover shadow-md 2lg:flex">
        <img
          alt=""
          src="/assets/images/home_search.png"
          className="absolute inset-0 h-full w-full rounded-xl object-cover"
        />
      </div>

      <Card className="w-full border-pink-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <RadioGroup
              defaultValue={tripType}
              onValueChange={(value) =>
                setTripType(value as "one-way" | "round-trip")
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="one-way"
                  id="one-way"
                  className="text-orange-500"
                />
                <Label htmlFor="one-way">{t("one-way")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="round-trip"
                  id="round-trip"
                  className="text-orange-500"
                />
                <Label htmlFor="round-trip">{t("round-trip")}</Label>
              </div>
            </RadioGroup>
            <a href="#" className="text-orange-500 text-sm">
              {t("ticket-guide")}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Label className="text-sm mb-1 block">{t("origin")}</Label>
              <Combobox
                value={origin}
                onChange={setOrigin}
                options={southernVietnamCities.filter(
                  (city) => city.value !== destination
                )}
                placeholder={t("select-origin")}
                className="p-6"
              />
            </div>

            <div className="relative">
              <Label className="text-sm mb-1 block">{t("destination")}</Label>
              <div className="flex items-center">
                <Combobox
                  value={destination}
                  onChange={setDestination}
                  options={southernVietnamCities.filter(
                    (city) => city.value !== origin
                  )}
                  placeholder={t("select-destination")}
                  className="w-full p-6"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -left-7.5 shadow-2lg bg-amber-50 rounded-full"
                  onClick={swapLocations}
                >
                  <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm mb-1 block">
                {t("departure-date")}
              </Label>
              <Popover>
                <PopoverTrigger asChild className="py-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border focus-visible:ring-orange-500"
                  >
                    {departureDate ? (
                      <>
                        {format(departureDate, "dd/MM/yyyy")}
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(departureDate, "EEEE", {
                            locale: currentLocale,
                          })}
                        </div>
                      </>
                    ) : (
                      <span>{t("select-date")}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              {tripType === "round-trip" ? (
                <div className="flex w-full space-x-2">
                  <div className="w-9/12 ">
                    <Label className="text-sm mb-1 block">
                      {" "}
                      {t("return-date")}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild className="py-6">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border focus-visible:ring-orange-500"
                        >
                          {returnDate ? (
                            <>
                              {format(returnDate, "dd/MM/yyyy")}
                              <div className="text-xs text-muted-foreground mt-1">
                                {format(departureDate, "EEEE", {
                                  locale: currentLocale,
                                })}
                              </div>
                            </>
                          ) : (
                            <span className="text-muted-foreground">
                              {t("select-return-date")}
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          disabled={(date) =>
                            !!departureDate && date < departureDate
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="w-3/12 ">
                    <Label className="text-sm mb-1 block">{t("tickets")}</Label>
                    <Select defaultValue={tickets} onValueChange={setTickets}>
                      <SelectTrigger className="w-full focus:ring-orange-500 py-6">
                        <SelectValue placeholder={t("tickets")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <Label className="text-sm mb-1 block">{t("tickets")}</Label>
                  <Select defaultValue={tickets} onValueChange={setTickets}>
                    <SelectTrigger className="w-full focus:ring-orange-500 py-6">
                      <SelectValue placeholder={t("select-tickets")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {recentSearches.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">{t("recent-search")}</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-3 text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setOrigin(search.origin);
                      setDestination(search.destination);
                      setDepartureDate(search.date);
                    }}
                  >
                    <div className="font-medium">
                      {search.origin} - {search.destination}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {format(search.date, "dd/MM/yyyy")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-full"
            >
              {t("search-trip")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketBookingPage;
