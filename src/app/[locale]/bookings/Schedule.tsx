import { formatTime } from "@/lib/utils/TimeConverter";
import { TripTransit } from "@/services/API/tripAPI";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Schedule({
  tripTransits,
}: {
  tripTransits: TripTransit[];
}) {
  const t = useTranslations("Schedule");

  return (
    <div className="flex flex-col h-full border-2 gap-2">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto bg-white p-3 rounded-2xl shadow-lg">
        {tripTransits?.map((transit, idx) => (
          <div
            key={transit.id}
            className="mb-4 flex gap-5 items-center relative"
          >
            <p className="text-lg text-primary font-semibold">
              {formatTime(transit.arrivalTime || "")}
            </p>
            <Image
              src={`/assets/images/${
                idx === 0
                  ? "departure"
                  : idx === tripTransits.length - 1
                  ? "destination"
                  : "arrive"
              }.svg`}
              alt={"arrival-icon"}
              width={50}
              height={50}
              className="h-4 w-4"
            />
            <div>
              <p className="text-md font-semibold">
                {transit.transitPoint?.name}
              </p>
              <p className="text-gray-500">{transit.transitPoint?.address}</p>
            </div>
            {idx !== tripTransits.length - 1 && (
              <div className="absolute h-full left-[72px] transform translate-y-[65%] border-r-2 border-dotted"></div>
            )}
          </div>
        ))}
      </div>

      {/* Sticky footer note */}
      <div className="bg-white p-3 rounded-2xl shadow-lg">
        <h1 className="font-bold text-red-500 mb-1">{t("noted")}:</h1>
        <p className="text-sm text-gray-700">{t("note")}</p>
      </div>
    </div>
  );
}
