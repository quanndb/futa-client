import Schedule from "@/app/[locale]/bookings/Schedule";
import Transshipment from "@/app/[locale]/bookings/Transshipment";
import TripPolicy from "@/app/[locale]/bookings/TripPolicy";
import { Button } from "@/components/ui/button";
import { TripTransit } from "@/services/API/tripAPI";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

interface TripCardProps {
  tripId: string;
  activeTripId: string;
  departureTime: string;
  departureCity: string;
  duration: number;
  arrivalTime: string;
  arrivalCity: string;
  transportType: string;
  availableSeats: number;
  price: number;
  tripTransits: TripTransit[];
  setTripId: (id: string) => void;
}

enum Tabs {
  SCHEDULE = "schedule",
  TRANSSHIPMENT = "transshipment",
  POLICY = "policy",
}

const TripCard: React.FC<TripCardProps> = ({
  tripId,
  activeTripId,
  departureTime,
  departureCity,
  duration,
  arrivalTime,
  arrivalCity,
  transportType,
  availableSeats,
  price,
  tripTransits,
  setTripId,
}) => {
  const t = useTranslations();
  const [showMore, setShowMore] = React.useState<Tabs | null>(null);

  const handleShowMore = (tab: Tabs) => {
    if (showMore === tab) {
      setShowMore(null);
    } else {
      setShowMore(tab);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm bg-white">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between flex-1">
            <div className="flex flex-col items-center text-center px-5">
              <span className="text-2xl font-bold">{departureTime}</span>
              <div className="text-md text-primary font-bold">
                {departureCity}
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <Image
                src="/assets/images/departure.svg"
                alt="Departure"
                width={16}
                height={16}
              />
              <span className="flex-1 border-b-2 border-dotted" />
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500">
                  {duration} {t("common.hour")}
                </div>
                <div className="relative w-32">
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-gray-500">
                      (Asian/Ho Chi Minh)
                    </span>
                  </div>
                </div>
              </div>
              <span className="flex-1 border-b-2 border-dotted" />
              <Image
                src="/assets/images/destination.svg"
                alt="Destination"
                width={16}
                height={16}
              />
            </div>
            <div className="flex flex-col items-center space-x-2 text-center px-5">
              <span className="text-2xl font-bold">{arrivalTime}</span>
              <div className="text-md text-primary font-bold">
                {arrivalCity}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-secondary font-bold">
                {t(`busType.${transportType}`)}
              </span>
              <span className="text-sm text-secondary font-bold">•</span>
              <span className="text-sm text-secondary font-bold">
                {availableSeats} {t("blankSeat")}
              </span>
            </div>
            <div className="text-lg font-bold text-orange-500">
              {price.toLocaleString()}đ
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-4">
          <div className="space-x-4">
            <button
              className={`text-sm font-medium ${
                showMore === Tabs.SCHEDULE && "text-orange-600"
              }`}
              onClick={() => handleShowMore(Tabs.SCHEDULE)}
            >
              {t("schedule")}
            </button>
            <button
              className={`text-sm font-medium ${
                showMore === Tabs.TRANSSHIPMENT && "text-orange-600"
              }`}
              onClick={() => handleShowMore(Tabs.TRANSSHIPMENT)}
            >
              {t("transshipment")}
            </button>
            <button
              className={`text-sm font-medium ${
                showMore === Tabs.POLICY && "text-orange-600"
              }`}
              onClick={() => handleShowMore(Tabs.POLICY)}
            >
              {t("policy")}
            </button>
          </div>
          <Button
            variant={activeTripId === tripId ? "default" : "outline"}
            onClick={() => setTripId(tripId)}
          >
            {t("selectTrip")}
          </Button>
        </div>
        {/* toogle stuff */}
        {showMore && (
          <div className="h-[480px] bg-gray-100 overflow-hidden rounded-2xl">
            {showMore === Tabs.SCHEDULE && (
              <Schedule tripTransits={tripTransits} />
            )}
            {showMore === Tabs.TRANSSHIPMENT && <Transshipment />}
            {showMore === Tabs.POLICY && <TripPolicy />}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCard;
