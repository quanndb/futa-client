import { LocateCombobox } from "@/components/common/LocateComboBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailsTransit, TransitType } from "@/services/API/tripAPI";
import { useBooking } from "@/store/BookingStore";
import { useTranslations } from "next-intl";

export default function TransshipmentCard({
  departureTrip,
  returnTrip,
}: {
  departureTrip: DetailsTransit;
  returnTrip?: DetailsTransit;
}) {
  const t = useTranslations();
  const {
    setDepartureOrigin,
    setDepartureDestination,
    setReturnOrigin,
    setReturnDestination,
  } = useBooking();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          {t("book.transshipmentInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
        <div>
          <p className="mb-3 text-lg font-bold">
            {t("book.departureTrip")}
            {": "}
            <span className="text-primary">{departureTrip?.departureDate}</span>
          </p>
          <Trip
            transits={departureTrip}
            setOrigin={setDepartureOrigin}
            setDestination={setDepartureDestination}
          />
        </div>
        <div className="border-r-2 absolute top-0 left-1/2 h-[100%] hidden md:block" />
        {returnTrip && (
          <div>
            <p className="mb-3 text-lg font-bold">
              {t("book.returnTrip")}
              {": "}
              <span className="text-primary">{returnTrip?.departureDate}</span>
            </p>
            <Trip
              transits={returnTrip}
              setOrigin={setReturnOrigin}
              setDestination={setReturnDestination}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const Trip = ({
  transits,
  setOrigin,
  setDestination,
}: {
  transits: DetailsTransit;
  setOrigin: (value: string) => void;
  setDestination: (value: string) => void;
}) => {
  const t = useTranslations();
  return (
    <div>
      <p className="mb-2 text-md font-bold">{t("book.pickup")}</p>
      <LocateCombobox
        data={transits.transitPoints.filter(
          (item) => item.type !== TransitType.DROP
        )}
        defaultValue={transits.transitPoints[0]}
        onValueChange={setOrigin}
      />
      <p className="my-2 text-md font-bold">{t("book.drop")}</p>
      <LocateCombobox
        data={transits.transitPoints.filter(
          (item) => item.type !== TransitType.PICKUP
        )}
        defaultValue={transits.transitPoints[transits.transitPoints.length - 1]}
        onValueChange={setDestination}
      />
    </div>
  );
};
