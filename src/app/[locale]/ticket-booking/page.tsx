"use client";
import CustomerCard from "@/app/[locale]/ticket-booking/CustomerCard";
import TransshipmentCard from "@/app/[locale]/ticket-booking/TransshipmentCard";
import TripSeatsPage from "@/app/[locale]/ticket-booking/TripSeats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createCustomerSchema, CustomerFormValues } from "@/lib/schemas/user";
import { formatCurrencyVND } from "@/lib/utils/CurrencyFormater";
import bookingAPI, { BookingRequest } from "@/services/API/bookingAPI";
import tripAPI, { DetailsTransit } from "@/services/API/tripAPI";
import walletAPI from "@/services/API/walletAPI";
import { useUserInfo } from "@/store/AuthStore";
import { useBooking } from "@/store/BookingStore";
import { useLoading } from "@/store/LoadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function TicketBooking() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const departureDate = searchParams.get("departureDate") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const departureTripId = searchParams.get("departureTripId") || "";
  const returnTripId = searchParams.get("returnTripId") || "";
  const [isUseWallet, setIsUseWallet] = useState<boolean>(false);
  const [departureTripData, setDepartureTripData] = useState<
    DetailsTransit | undefined
  >(undefined);
  const [returnTripData, setReturnTripData] = useState<
    DetailsTransit | undefined
  >(undefined);

  const { mutate: getTripDetails } = useMutation({
    mutationFn: ({
      departureTripId,
      departureDate,
    }: {
      departureTripId: string;
      departureDate: string;
    }) => {
      return tripAPI.getTripDetails({ id: departureTripId, departureDate });
    },
  });
  const { setUserInfo, setDepartureTrip, setReturnTrip, reset, booking } =
    useBooking();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (departureTripId && departureDate) {
      getTripDetails(
        { departureTripId, departureDate },
        {
          onSuccess: (data) => {
            reset();
            if (returnTripId && returnDate) {
              getTripDetails(
                { departureTripId: returnTripId, departureDate: returnDate },
                {
                  onSuccess: (sub) => {
                    setDepartureTripData(data.data);
                    setReturnTripData(sub.data);
                    setDepartureTrip(departureTripId, departureDate);
                    setReturnTrip(returnTripId, returnDate);
                    return;
                  },
                }
              );
            }
            setDepartureTripData(data.data);
            setDepartureTrip(departureTripId, departureDate);
          },
        }
      );
    }
  }, [
    departureTripId,
    departureDate,
    returnTripId,
    returnDate,
    getTripDetails,
    setDepartureTrip,
    setReturnTrip,
    reset,
  ]);
  const { userInfo } = useUserInfo();
  const customerSchema = createCustomerSchema(t);
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: userInfo?.full_name || "",
      email: userInfo?.email || "",
      phone: "",
    },
  });

  const { mutate: book } = useMutation({
    mutationFn: (booking: BookingRequest) => {
      return bookingAPI.book(booking);
    },
  });

  const { mutate: createPayment } = useMutation({
    mutationFn: ({
      code,
      isUseWallet,
    }: {
      code: string;
      isUseWallet: boolean;
    }) => {
      return bookingAPI.createPayment(code, isUseWallet);
    },
  });

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      return toast.error(t("validations.notFillAll"));
    }
    if (booking.departureTrip.seats.length === 0)
      return toast.error(t("validations.notSelectSeat"));

    if (booking.returnTrip && booking.returnTrip.seats.length === 0)
      return toast.error(t("validations.notSelectSeat"));

    const values = form.getValues();
    setUserInfo(values);
    setIsLoading(true);
    book(
      {
        ...booking,
        ...values,
      },
      {
        onSuccess: (data) => {
          toast.success(t("success"));
          handlePay(data.data.code);
        },
      }
    );
  };
  const handlePay = (code: string) => {
    setTimeout(() => {
      createPayment(
        { code: code, isUseWallet },
        {
          onSuccess: (res) => {
            toast.success(t("success"));
            if (res?.data?.paymentLink) {
              window.open(res.data.paymentLink, "_blank");
            }
            setIsLoading(false);
            router.push(`/profile/bookingHistory`);
          },
        }
      );
    }, 3000);
  };

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => {
      return walletAPI.getMyWallet();
    },
  });

  return (
    <div className="bg-[#f3f3f5] min-h-screen py-20">
      <div className="layout w-full space-y-10">
        {departureTripData && (
          <div className="space-y-8">
            <TripSeatsPage
              departureTrip={departureTripData}
              returnTrip={returnTripData}
            />
            <Card className="p-6">{form && <CustomerCard form={form} />}</Card>
            <Card className="p-6">
              <TransshipmentCard
                departureTrip={departureTripData}
                returnTrip={returnTripData}
              />
            </Card>
          </div>
        )}

        <Card className="p-8 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4">
            <p className="text-3xl font-bold text-primary">
              {t("book.total")}{" "}
              {calculateTotalPrice(
                booking.departureTrip.seats.length || 0,
                departureTripData?.pricePerSeat || 0,
                booking.returnTrip?.seats.length || 0,
                returnTripData?.pricePerSeat || 0
              )}
            </p>

            <div className="space-y-2">
              <p className="text-muted-foreground">
                {t("book.yourBalance")}{" "}
                <span className="font-semibold text-black">
                  {formatCurrencyVND(wallet?.data?.currentBalance || 0)}
                </span>
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={isUseWallet}
                  onCheckedChange={(e) => setIsUseWallet(e as boolean)}
                />
                <span className="text-sm font-medium">
                  {t("book.useWallet")}
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-0 self-stretch md:self-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full md:w-auto p-5 cursor-pointer"
            >
              {t("common.action.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full md:w-auto p-5 cursor-pointer"
            >
              {t("common.action.submit")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

const calculateTotalPrice = (
  departureSeats: number,
  departurePrice: number,
  returnSeats: number,
  returnPrice: number
) => {
  if (!returnSeats) {
    return formatCurrencyVND(departureSeats * departurePrice);
  }
  return formatCurrencyVND(
    departureSeats * departurePrice + returnSeats * returnPrice
  );
};
