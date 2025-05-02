"use client";
import ReturnTicketModal from "@/components/common/ReturnTicketModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatCurrencyVND } from "@/lib/utils/CurrencyFormater";
import { formatToLocalDateTime } from "@/lib/utils/DateConverter";
import { isAfterNow24h, nowIsBefore20Min } from "@/lib/utils/dateUtils";
import { formatTime } from "@/lib/utils/TimeConverter";
import bookingAPI, {
  BookingDetailsType,
  BookingResponse,
  BookingStatus,
} from "@/services/API/bookingAPI";
import { useLoading } from "@/store/LoadingStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Ticket,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, use, useState } from "react";
import { toast } from "react-toastify";

export default function BookingDetails({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const { setIsLoading } = useLoading();
  const t = useTranslations("booking");
  const [openReturnModal, setOpenReturnModal] = useState<string>("");

  const { data, refetch } = useQuery({
    queryKey: ["booking", code],
    queryFn: () => {
      setIsLoading(true);
      return bookingAPI
        .getBookingDetails(code)
        .finally(() => setIsLoading(false));
    },
    staleTime: 3000,
    gcTime: 3000,
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {data && (
        <Card className="overflow-hidden shadow-lg rounded-xl">
          <div className="bg-primary p-5 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="text-2xl font-bold">
                {t("bookingDetails")}:{" "}
                <span className="font-mono">{data.data.code}</span>
              </h1>
              <StatusBadge status={data.data.status} />
            </div>
          </div>

          <div className="p-6 space-y-8">
            <CustomerInfo departureTrip={data.data.departureTrip} />

            <div className="border-t border-gray-200 pt-6">
              <BookingTrips
                bookingDetails={data.data.departureTrip}
                label={t("departureTrip")}
              />
            </div>

            {data.data.returnTrip && (
              <div className="border-t border-gray-200 pt-6">
                <BookingTrips
                  bookingDetails={data.data.returnTrip}
                  label={t("returnTrip")}
                />
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <Details booking={data.data} />
            </div>

            <Action
              booking={data.data}
              refetch={refetch}
              setReturnModal={setOpenReturnModal}
            />
          </div>
        </Card>
      )}
      <ReturnTicketModal
        open={openReturnModal}
        onOpenChange={setOpenReturnModal}
        refetch={refetch}
      />
    </div>
  );
}

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const t = useTranslations("booking.status");

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PAYED:
        return "bg-green-100 text-green-800 border-green-200";
      case BookingStatus.WAIT_TO_PAY:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case BookingStatus.OUT_OF_PAY:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case BookingStatus.RETURNED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case BookingStatus.FAILED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge
      className={`px-3 py-1 font-medium text-sm ${getStatusColor(status)}`}
    >
      {t(status.toLowerCase())}
    </Badge>
  );
};

const Field = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon} {label}
    </Label>
    <Input
      value={value}
      readOnly
      className="bg-gray-50 border border-gray-200 focus:ring-primary"
    />
  </div>
);

const CustomerInfo = ({
  departureTrip,
  className,
}: {
  departureTrip: BookingDetailsType;
  className?: string;
}) => {
  const t = useTranslations("booking");

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
        <User size={20} /> {t("customerInformation")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field
          label={t("name")}
          value={departureTrip.fullName}
          icon={<User size={16} />}
        />
        <Field
          label={t("email")}
          value={departureTrip.email}
          icon={<Mail size={16} />}
        />
        <Field
          label={t("phone")}
          value={departureTrip.phone}
          icon={<Phone size={16} />}
        />
      </div>
    </div>
  );
};

const BookingTrips = ({
  className,
  bookingDetails,
  label,
}: {
  className?: string;
  bookingDetails: BookingDetailsType;
  label: string;
}) => {
  const t = useTranslations("booking");

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
        <Ticket size={20} /> {label}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <MapPin size={16} /> {t("departure")}
          </h3>
          <p className="text-lg font-semibold mb-1">
            {bookingDetails.departure}
          </p>
          <p className="text-gray-600 mb-3 text-sm">
            {bookingDetails.departureAddress}
          </p>
          <div className="flex items-center gap-2 text-blue-700">
            <Clock size={16} />
            <span className="font-mono">
              {formatTime(bookingDetails.departureTime)}
            </span>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <h3 className="font-medium text-indigo-800 mb-2 flex items-center gap-2">
            <MapPin size={16} /> {t("destination")}
          </h3>
          <p className="text-lg font-semibold mb-1">
            {bookingDetails.destination}
          </p>
          <p className="text-gray-600 mb-3 text-sm">
            {bookingDetails.destinationAddress}
          </p>
          <div className="flex items-center gap-2 text-indigo-700">
            <Clock size={16} />
            <span className="font-mono">
              {formatTime(bookingDetails.destinationTime)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field
          label={t("departureDate")}
          value={bookingDetails.departureDate}
          icon={<CalendarIcon size={16} />}
        />
        <Field
          label={t("route")}
          value={bookingDetails.route}
          icon={<MapPin size={16} />}
        />
        <Field
          label={t("pricePerSeat")}
          value={formatCurrencyVND(bookingDetails.pricePerSeat)}
          icon={<CreditCard size={16} />}
        />
      </div>

      <div className="mt-4">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
          <Ticket size={16} /> {t("seatNumbers")}
        </Label>
        <div className="flex flex-wrap gap-2">
          {bookingDetails.tickets.map((ticket) => (
            <Badge
              key={ticket.seatNumber}
              className="bg-primary/10 text-primary border border-primary/20 px-3 py-1"
            >
              {ticket.seatNumber}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

const Details = ({ booking }: { booking: BookingResponse }) => {
  const t = useTranslations("booking");

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
        <CreditCard size={20} /> {t("bookingDetails")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex flex-col">
          <span className="text-sm text-green-700">{t("totalPrice")}</span>
          <span className="text-2xl font-bold text-green-800">
            {formatCurrencyVND(booking.totalPrice)}
          </span>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 flex flex-col">
          <span className="text-sm text-purple-700">{t("numOfTickets")}</span>
          <span className="text-2xl font-bold text-purple-800">
            {booking.numOfTickets} {t("tickets")}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Field
          label={t("createdAt")}
          value={formatToLocalDateTime(booking.createdAt)}
          icon={<CalendarIcon size={16} />}
        />
      </div>
    </div>
  );
};

const Action = ({
  booking,
  refetch,
  setReturnModal,
}: {
  booking: BookingResponse;
  refetch: () => void;
  setReturnModal: Dispatch<SetStateAction<string>>;
}) => {
  const t = useTranslations("booking");

  const { mutate: createPayment, isPending: isCreatingPayment } = useMutation({
    mutationFn: (data: { code: string; isUseWallet: boolean }) =>
      bookingAPI.createPaymentLink(data.code, data.isUseWallet),
    onSuccess: (res) => {
      if (res?.data?.paymentLink) {
        window.open(res.data.paymentLink, "_blank");
      }
      toast.success(t("paymentSuccess"));
      refetch();
    },
  });

  const handlePay = (code: string, paymentLink: string) => {
    if (paymentLink) {
      window.open(paymentLink, "_blank");
      return;
    }
    createPayment({ code, isUseWallet: false });
  };

  const handleReturnTicket = (code: string) => {
    setReturnModal(code);
  };

  if (
    booking.status === BookingStatus.PAYED &&
    isAfterNow24h(booking.departureTime)
  ) {
    return (
      <div className="border-t border-gray-200 pt-6 flex justify-end">
        <Button
          className="px-6 py-2 flex items-center gap-2 bg-red-600 hover:bg-red-700"
          onClick={() => handleReturnTicket(booking.code)}
        >
          {t("returnTicket")}
        </Button>
      </div>
    );
  }

  if (
    booking.status === BookingStatus.WAIT_TO_PAY &&
    nowIsBefore20Min(booking.createdAt)
  ) {
    return (
      <div className="border-t border-gray-200 pt-6 flex justify-end">
        <Button
          className="px-6 py-2 flex items-center gap-2 bg-primary hover:bg-primary/90"
          onClick={() => handlePay(booking.code, booking?.paymentLink || "")}
          disabled={isCreatingPayment}
        >
          <CreditCard size={18} />
          {isCreatingPayment ? t("processing") : t("pay")}
        </Button>
      </div>
    );
  }

  return null;
};
