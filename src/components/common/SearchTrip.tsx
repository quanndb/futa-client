"use client";
import AutoComplete from "@/components/ui/autocomplete";
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
import { AutocompleteOption } from "@/lib/types/common";
import { cn } from "@/lib/utils";
import { formatDateToYYYYMMDD } from "@/lib/utils/DateConverter";
import transitAPI from "@/services/API/transitAPI";
import { useRecentSearches } from "@/store/RecentSearches";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowRightLeftIcon, CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

const enum TripType {
  ONEWAY = "one-way",
  ROUND_TRIP = "round-trip",
}

const SearchTrip = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>(TripType.ONEWAY);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    new Date()
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [origin, setOrigin] = useState<AutocompleteOption | null>(null);
  const [destination, setDestination] = useState<AutocompleteOption | null>(
    null
  );
  const { recentSearches, addRecentSearch } = useRecentSearches();

  useEffect(() => {
    if (recentSearches.length > 0) {
      setOrigin(recentSearches[0].origin);
      setDestination(recentSearches[0].destination);
    }
  }, [recentSearches]);

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination) {
      toast.error(t("departureAndDestinationRequired"));
      return;
    }
    if (tripType === TripType.ROUND_TRIP && !returnDate) {
      toast.error(t("returnDateRequired"));
      return;
    }
    addRecentSearch({ origin, destination });
    const searchParams = new URLSearchParams({
      departure: origin?.value,
      destination: destination?.value,
      departureDate: formatDateToYYYYMMDD(departureDate),
    });
    if (tripType === TripType.ROUND_TRIP) {
      searchParams.append("returnDate", formatDateToYYYYMMDD(returnDate));
    }
    router.push(`/bookings?${searchParams.toString()}`);
  };

  // sub component
  const Banner = () => {
    return (
      <div className="relative hidden lg:block mb-10 h-[250px] w-full cursor-pointer rounded-xl object-cover shadow-md 2lg:flex">
        <Image
          alt=""
          src="/assets/images/home_search.png"
          width={1500}
          height={300}
          className="absolute inset-0 h-full w-full rounded-xl object-cover card-box-shadown"
        />
      </div>
    );
  };

  const SearchCard = () => {
    return (
      <Card className="w-full border-pink-100 shadow-sm search-form">
        <CardContent className="pt-6">
          <TripTypeRadioGroup />
          <div className="flex flex-col md:flex-row flex-wrap gap-5">
            <InputStation />
            <InputDate />
          </div>
          <RecentSearch />
          <SearchButton />
        </CardContent>
      </Card>
    );
  };

  const TripTypeRadioGroup = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <RadioGroup
          defaultValue={tripType}
          onValueChange={(value) => setTripType(value as TripType)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={TripType.ONEWAY}
              id={TripType.ONEWAY}
              className="text-orange-500"
            />
            <Label
              htmlFor={TripType.ONEWAY}
              className={tripType === TripType.ONEWAY ? "text-primary" : ""}
            >
              {t(TripType.ONEWAY)}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={TripType.ROUND_TRIP}
              id={TripType.ROUND_TRIP}
              className="text-orange-500"
            />
            <Label
              htmlFor={TripType.ROUND_TRIP}
              className={tripType === TripType.ROUND_TRIP ? "text-primary" : ""}
            >
              {t(TripType.ROUND_TRIP)}
            </Label>
          </div>
        </RadioGroup>
        <a
          href="https://futabus.vn/huong-dan-dat-ve-tren-web"
          className="text-primary text-sm"
        >
          {t("ticket-guide")}
        </a>
      </div>
    );
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: AutocompleteOption[]) => void
  ) => {
    transitAPI
      .getTransit({
        keyword: inputValue,
        sortBy: "name.asc",
      })
      .then((res) => {
        const options = res.data.map((tp) => ({
          label: tp.name,
          value: tp.id,
        }));
        callback(options);
      })
      .catch((error) => {
        console.error("Error loading options:", error);
        callback([]);
      });
  };

  const InputStation = () => {
    return (
      <div className="flex flex-col md:flex-row md:flex-2 gap-5 relative">
        {/* departure */}
        <div className="flex-1">
          <Label className="text-sm mb-1 block">{t("origin")}</Label>
          <AutoComplete
            loadOptions={loadOptions}
            placeholder={t("origin")}
            value={origin}
            onChangeValue={setOrigin}
            className="w-full h-full"
          />
        </div>
        {/* destination */}
        <div className="flex-1">
          <Label className="text-sm mb-1 block">{t("destination")}</Label>
          <AutoComplete
            loadOptions={loadOptions}
            placeholder={t("destination")}
            value={destination}
            onChangeValue={setDestination}
            className="w-full h-full"
          />
        </div>
        {/* swap button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shadow-2lg bg-white rounded-full border cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/5 z-100"
          onClick={swapLocations}
        >
          <ArrowRightLeftIcon className="h-4 w-4 text-orange-500" />
        </Button>
      </div>
    );
  };

  const InputDate = () => {
    return (
      <Fragment>
        <div className="md:flex-1">
          <Label className="text-sm mb-1 block">{t("departure-date")}</Label>
          <Popover>
            <PopoverTrigger asChild className="pt-6 pb-5">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border focus-visible:ring-orange-500"
              >
                {departureDate ? (
                  <>
                    {format(departureDate, "dd/MM/yyyy")}
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(departureDate, "EEEE", {
                        locale: vi,
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
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {tripType === "round-trip" && (
          <div className="w-full space-x-2 md:flex-1">
            <Label className="text-sm mb-1 block">{t("return-date")}</Label>
            <Popover>
              <PopoverTrigger asChild className="pt-6 pb-5">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border focus-visible:ring-orange-500"
                >
                  {returnDate ? (
                    <>
                      {format(returnDate, "dd/MM/yyyy")}
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(returnDate, "EEEE", {
                          locale: vi,
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
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </Fragment>
    );
  };

  const SearchButton = () => {
    return (
      <div className="flex justify-center relative transform translate-y-7 -m-5">
        <Button
          onClick={handleSearch}
          className="bg-primary hover:bg-orange-500 hover:shadow-xl hover:transform hover:-translate-y-1 
         text-white px-10 py-6 rounded-full 
         cursor-pointer"
        >
          {t("search-trip")}
        </Button>
      </div>
    );
  };

  const RecentSearch = () => {
    const recentSearches = useRecentSearches((state) => state.recentSearches);
    return (
      <div>
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
                  }}
                >
                  <div className="font-medium">
                    {search.origin.label} - {search.destination.label}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {format(new Date(), "dd/MM/yyyy")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("mx-auto", className)}>
      <div className="absolute max-w-6xl top-20 left-1/2 transform -translate-x-1/2 w-full mt-12 px-5">
        <Banner />
        <SearchCard />
        {children}
      </div>
    </div>
  );
};

export default SearchTrip;
