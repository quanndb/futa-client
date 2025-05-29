"use client";

import TripFilter, { TripFilterType } from "@/app/[locale]/bookings/TripFilter";
import TripList from "@/app/[locale]/bookings/TripList";
import SearchTrip from "@/components/common/SearchTrip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import tripAPI, {
  TripFilterRequest,
  TripOrderBy,
  TripResponse,
} from "@/services/API/tripAPI";
import { useLoading } from "@/store/LoadingStore";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const serializeFilter = (
  filter: TripFilterType
): Record<string, string | string[]> => {
  const params: Record<string, string | string[]> = {};
  if (filter["departureTime.fromTime"])
    params["departureTime.fromTime"] = filter["departureTime.fromTime"];
  if (filter["departureTime.toTime"])
    params["departureTime.toTime"] = filter["departureTime.toTime"];
  if (filter.busType && filter.busType.length > 0)
    params["busType"] = filter.busType;
  if (filter.orderBy && filter.orderBy.length > 0)
    params["orderBy"] = filter.orderBy;
  return params;
};

const sortTrips = (trips: TripResponse[], orderBy: TripOrderBy[]) => {
  const sorted = [...trips];
  if (orderBy.includes(TripOrderBy.PRICE)) {
    sorted.sort((a, b) => a.details.price - b.details.price);
  }
  if (orderBy.includes(TripOrderBy.DEPARTURE_TIME)) {
    sorted.sort((a, b) => {
      const diffA = a.tripTransits[0].arrivalTime || "";
      const diffB = b.tripTransits[0].arrivalTime || "";
      return diffA.localeCompare(diffB);
    });
  }
  return sorted;
};

export default function TicketResults() {
  const searchParams = useSearchParams();
  const departure = searchParams.get("departure") || "";
  const destination = searchParams.get("destination") || "";
  const departureDate = searchParams.get("departureDate") || "";
  const returnDate = searchParams.get("returnDate") || "";

  const [filter, setFilter] = useState<TripFilterType>({
    "departureTime.fromTime": "",
    "departureTime.toTime": "",
    busType: [],
    orderBy: [],
  });

  const [departureTrip, setDepartureTrip] = useState<TripResponse[]>([]);
  const [returnTrip, setReturnTrip] = useState<TripResponse[]>([]);

  const { setIsLoading } = useLoading();

  const { mutate: getTrips } = useMutation({
    mutationFn: ({
      departure,
      destination,
      departureDate,
      filter,
    }: {
      departure: string;
      destination: string;
      departureDate: string;
      filter: TripFilterType;
    }) => {
      setIsLoading(true);
      return tripAPI
        .getTrips({
          departureId: departure,
          destinationId: destination,
          departureDate,
          ...serializeFilter(filter),
        } as TripFilterRequest)
        .finally(() => setIsLoading(false));
    },
  });

  useEffect(() => {
    if (departure && destination && departureDate) {
      getTrips(
        { departure, destination, departureDate, filter },
        {
          onSuccess: (data) => {
            if (returnDate) {
              getTrips(
                {
                  departure: destination,
                  destination: departure,
                  departureDate: returnDate,
                  filter,
                },
                {
                  onSuccess: (subData) => {
                    setDepartureTrip(data.data);
                    setReturnTrip(subData.data);
                  },
                }
              );
            } else {
              setDepartureTrip(data.data);
            }
          },
        }
      );
    }
  }, [departure, destination, departureDate, returnDate, getTrips, filter]);

  return (
    <div className="bg-white-dark pb-20">
      <SearchTrip />
      <div className="layout mt-200 sm:mt-150 md:mt-100 lg:mt-160">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <TripFilter filter={filter} setFilter={setFilter} />
          <TripTab
            departureDate={departureDate}
            departureTrip={departureTrip}
            returnDate={returnDate}
            returnTrip={returnTrip}
            filter={filter}
          />
        </div>
      </div>
    </div>
  );
}

const TripTab = ({
  departureDate,
  departureTrip,
  returnDate,
  returnTrip,
  filter,
}: {
  departureDate: string;
  departureTrip: TripResponse[];
  returnDate: string;
  returnTrip: TripResponse[];
  filter: TripFilterType;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [tab, setTab] = useState("departure");
  const [departureTripId, setDepartureTripId] = useState("");
  const [returnTripId, setReturnTripId] = useState("");

  useEffect(() => {
    if (departureTripId && departureDate && returnDate && returnTripId) {
      router.push(
        `/ticket-booking?departureDate=${departureDate}&returnDate=${returnDate}&departureTripId=${departureTripId}&returnTripId=${returnTripId}`
      );
    } else if (departureTripId && departureDate && !returnDate) {
      router.push(
        `/ticket-booking?departureDate=${departureDate}&departureTripId=${departureTripId}`
      );
    }
  }, [departureTripId, departureDate, returnTripId, returnDate, router]);

  const handleSetState = (tripId: string) => {
    if (tab === "departure") {
      setDepartureTripId(tripId === departureTripId ? "" : tripId);
      if (tripId !== departureTripId) setTab("return");
    } else {
      setReturnTripId(tripId === returnTripId ? "" : tripId);
      if (tripId !== returnTripId) setTab("departure");
    }
  };

  return (
    <Tabs
      className="lg:col-span-3"
      defaultValue="departure"
      value={tab}
      onValueChange={setTab}
    >
      <TabsList className="w-full flex justify-start bg-white shadow-md">
        <div
          className={cn(
            tab === "departure" ? "bg-primary text-white" : "",
            "flex-1 rounded-md"
          )}
        >
          <TabsTrigger
            value="departure"
            className={cn("rounded-2xl", tab === "departure" && "text-white")}
          >
            {t("departureTrip")} {departureDate}
          </TabsTrigger>
        </div>
        {returnDate && (
          <div
            className={cn(
              tab === "return" ? "bg-primary text-white" : "",
              "flex-1 rounded-md"
            )}
          >
            <TabsTrigger
              value="return"
              className={cn("rounded-2xl", tab === "return" && "text-white")}
            >
              {t("returnTrip")} {returnDate}
            </TabsTrigger>
          </div>
        )}
      </TabsList>
      <TabsContent value="departure">
        <TripList
          trips={sortTrips(departureTrip, filter.orderBy)}
          tripId={departureTripId}
          setTripId={handleSetState}
        />
      </TabsContent>
      {returnDate && (
        <TabsContent value="return">
          <TripList
            trips={sortTrips(returnTrip, filter.orderBy)}
            tripId={returnTripId}
            setTripId={handleSetState}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};
