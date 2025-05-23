import Schedule from "@/app/[locale]/bookings/Schedule";
import ToolTip from "@/components/common/ToolTip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrencyVND } from "@/lib/utils/CurrencyFormater";
import bookingAPI from "@/services/API/bookingAPI";
import { BusType, DetailsTransit, Seat } from "@/services/API/tripAPI";
import { useBooking } from "@/store/BookingStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TripSeatsPage({
  departureTrip,
  returnTrip,
}: {
  departureTrip: DetailsTransit;
  returnTrip?: DetailsTransit;
}) {
  const t = useTranslations();
  const {
    setDepartureSeat,
    getSelectedSeats,
    setReturnSeat,
    getReturnSelectedSeats,
  } = useBooking();

  const [bookedReturnData, setBookedReturnData] = useState<string[]>([]);
  const [bookedDepartureData, setBookedDepartureData] = useState<string[]>([]);

  useEffect(() => {
    if (departureTrip) {
      bookingAPI
        .getBookedSeats(
          departureTrip.tripDetailsId,
          departureTrip.departureDate
        )
        .then((res) => {
          setBookedDepartureData(res.data);
        });
    }
    if (returnTrip) {
      bookingAPI
        .getBookedSeats(returnTrip.tripDetailsId, returnTrip.departureDate)
        .then((res) => {
          setBookedReturnData(res.data);
        });
    }
  }, [departureTrip, returnTrip]);

  return (
    <Card className="p-10">
      <p className="font-bold text-3xl">{t("book.selectSeats")}</p>
      <div className="flex justify-between relative">
        <div>
          <p className="font-bold text-lg">
            {t("book.departureTrip")}
            <span>
              {": "}
              <span className="text-primary">
                {departureTrip?.departureDate}
              </span>
            </span>
          </p>
          <TripSeats
            trip={departureTrip}
            onSelect={setDepartureSeat}
            bookedSeats={bookedDepartureData}
            selectedSeats={getSelectedSeats()}
          />
        </div>
        {returnTrip && (
          <div>
            <p className="font-bold text-lg">
              {t("book.returnTrip")}
              <span>
                {": "}
                <span className="text-primary">
                  {returnTrip?.departureDate}
                </span>
              </span>
            </p>{" "}
            <TripSeats
              trip={returnTrip}
              onSelect={setReturnSeat}
              bookedSeats={bookedReturnData}
              selectedSeats={getReturnSelectedSeats()}
            />
          </div>
        )}
        <div className="border-r-2 absolute top-0 left-1/2 h-[100%]" />
      </div>
      <Note />
    </Card>
  );
}

const TripSeats = ({
  trip,
  onSelect,
  selectedSeats,
  bookedSeats,
}: {
  trip?: DetailsTransit;
  onSelect: (seatNumber: string) => void;
  selectedSeats: string[];
  bookedSeats?: string[];
}) => {
  const t = useTranslations();
  return (
    <div className="">
      {trip && trip?.firstFloorSeats && (
        <div className="flex flex-col items-center">
          <ToolTip
            trigger={
              <Button
                variant={"link"}
                className="underline decoration-2 mb-5 cursor-pointer"
              >
                {t("book.busInfo")}
              </Button>
            }
            content={<Schedule tripTransits={trip.transitPoints} />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-15">
            <div>
              <p className="text-center mb-5 font-semibold">
                {t("book.firstFloor")}
              </p>
              <SeatCard
                seats={trip.firstFloorSeats}
                isSeat={trip?.type === BusType.SEAT}
                onSelect={onSelect}
                selectedSeats={selectedSeats}
                bookedSeats={bookedSeats}
              />
            </div>
            {trip?.secondFloorSeats && (
              <div>
                <p className="text-center mb-5 font-semibold">
                  {t("book.secondFloor")}
                </p>
                <SeatCard
                  seats={trip.secondFloorSeats}
                  isSeat={trip?.type === BusType.SEAT}
                  onSelect={onSelect}
                  selectedSeats={selectedSeats}
                  bookedSeats={bookedSeats}
                />
              </div>
            )}
          </div>
          <p className="text-center mt-5 font-bold text-xl">
            {t("book.price")}
            <span>
              :{" "}
              <span className="text-primary">
                {formatCurrencyVND(trip.pricePerSeat)}
              </span>
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

const SeatCard = ({
  seats,
  bookedSeats,
  selectedSeats,
  isSeat = false,
  onSelect,
}: {
  seats: Seat[];
  bookedSeats?: string[];
  selectedSeats?: string[];
  isSeat?: boolean;
  onSelect: (setNumber: string) => void;
}) => {
  const t = useTranslations();
  return (
    <div
      className={cn(
        `grid gap-y-2 gap-x-5 items-center`,
        isSeat ? "grid-cols-4" : "grid-cols-3"
      )}
    >
      {seats.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            if (item.seatNumber) {
              if (bookedSeats?.includes(item?.seatNumber)) return;
              if (selectedSeats?.length === 5) {
                toast.error(t("validations.maxSeat"));
                return;
              }
              onSelect(item.seatNumber);
            }
          }}
        >
          {item.seatNumber ? (
            <div className="relative flex justify-center">
              <div>
                <Image
                  src={`/assets/images/${
                    bookedSeats?.includes(item.seatNumber)
                      ? "disable"
                      : selectedSeats?.includes(item.seatNumber)
                      ? "selected"
                      : "able"
                  }.svg`}
                  width={40}
                  height={40}
                  alt="Able"
                />
                <span
                  className={`absolute top-1 left-1/2 -translate-x-1/2  font-bold text-sm ${
                    bookedSeats?.includes(item.seatNumber)
                      ? "text-gray-400 cursor-not-allowed"
                      : selectedSeats?.includes(item.seatNumber)
                      ? "text-orange-500 cursor-pointer"
                      : "text-blue-500 cursor-pointer"
                  }`}
                >
                  {item.seatNumber}
                </span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ))}
    </div>
  );
};

const Note = () => {
  const t = useTranslations();
  return (
    <div>
      <div className="ml-4 mt-5 flex gap-4 text-[13px] font-normal justify-center">
        <span className="mr-8 flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-[#D5D9DD] border-[#C0C6CC]"></div>
          {t("book.sold")}
        </span>
        <span className="mr-8 flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-[#DEF3FF] border-[#96C5E7]"></div>
          {t("book.able")}
        </span>
        <span className=" flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-[#FDEDE8] border-[#F8BEAB]"></div>
          {t("book.selected")}
        </span>
      </div>
      <p className="italic mt-5">
        {t("book.note")}{" "}
        <span className="text-primary">{t("book.5perTrip")}</span>
      </p>
    </div>
  );
};
