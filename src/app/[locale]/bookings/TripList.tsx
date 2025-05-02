import TripCard from "@/app/[locale]/bookings/TripCard";
import { calculateTimeDifference, formatTime } from "@/lib/utils/TimeConverter";
import { TripResponse } from "@/services/API/tripAPI";
import { useTranslations } from "next-intl";

export default function TripList({
  trips,
  tripId,
  setTripId,
}: {
  trips: TripResponse[];
  tripId: string;
  setTripId: (id: string) => void;
}) {
  const t = useTranslations();
  return (
    <div className="lg:col-span-3">
      <div>
        <p className="text-primary font-bold mb-5 text-xl">
          ({trips?.length || 0}) {t("foundResults")}
        </p>

        <div className="flex flex-col gap-4">
          {trips?.map((trip) => (
            <TripCard
              key={trip.id}
              activeTripId={tripId}
              tripId={trip.id}
              tripTransits={trip.tripTransits}
              departureTime={formatTime(trip.tripTransits[0].arrivalTime || "")}
              departureCity={trip.tripTransits[0].transitPoint?.name || ""}
              duration={calculateTimeDifference(
                trip.tripTransits[0].arrivalTime || "",
                trip.tripTransits[trip.tripTransits.length - 1].arrivalTime ||
                  ""
              )}
              arrivalTime={formatTime(
                trip.tripTransits[trip.tripTransits.length - 1].arrivalTime ||
                  ""
              )}
              arrivalCity={
                trip.tripTransits[trip.tripTransits.length - 1].transitPoint
                  ?.name || ""
              }
              transportType={trip.details.type}
              availableSeats={trip.details.typeDetails.seatCapacity}
              price={trip.details.price}
              setTripId={setTripId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
