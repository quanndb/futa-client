import ReturnTicketModal from "@/components/common/ReturnTicketModal";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/ui/customPagination";
import { DatePicker } from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyVND } from "@/lib/utils/CurrencyFormater";
import {
  formatToLocalDateTime,
  formatToLocalDateTimeWithTimeZone,
} from "@/lib/utils/DateConverter";
import { isAfterNow24h, nowIsBefore20Min } from "@/lib/utils/dateUtils";
import { toCamelCase } from "@/lib/utils/stringUtil";
import bookingAPI, { BookingStatus } from "@/services/API/bookingAPI";
import { SelectItem, SelectValue } from "@radix-ui/react-select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function BookingHistory() {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [departureDate, setDepartureDate] = useState<string | undefined>("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [selected, setSelected] = useState("");

  const { data, refetch } = useQuery({
    queryKey: ["bookingHistory", page, keyword, departureDate, status],
    queryFn: () =>
      bookingAPI.getMyBooking({
        pageIndex: page,
        pageSize: 10,
        keyword,
        departureDate: departureDate,
        status: status === "all" ? undefined : [status],
      }),
  });

  const totalPage = Math.ceil(
    (data?.page.total || 1) / (data?.page.pageSize || 1)
  );

  const { mutate: createPayment } = useMutation({
    mutationFn: (data: { code: string; isUseWallet: boolean }) =>
      bookingAPI.createPaymentLink(data.code, data.isUseWallet),
    onSuccess: (res) => {
      refetch();
      if (res?.data?.paymentLink) {
        window.open(res.data.paymentLink, "_blank");
      }
      toast.success(t("success"));
    },
  });

  const handlePay = (code: string, paymentLink: string) => {
    if (paymentLink) {
      window.open(paymentLink, "_blank");
      return;
    }
    createPayment({ code, isUseWallet: false });
  };

  const StatusConverter = (action: BookingStatus) => {
    switch (action) {
      case BookingStatus.PAYED:
        return {
          label: t("bookingStatus.payed"),
          color: "bg-green-100 text-green-800",
        };
      case BookingStatus.FAILED:
        return {
          label: t("bookingStatus.failed"),
          color: "bg-red-100 text-red-800",
        };
      case BookingStatus.WAIT_TO_PAY:
        return {
          label: t("bookingStatus.waitToPay"),
          color: "bg-blue-100 text-blue-800",
        };
      case BookingStatus.OUT_OF_PAY:
        return {
          label: t("bookingStatus.outOfPay"),
          color: "bg-yellow-100 text-yellow-800",
        };
      case BookingStatus.RETURNED:
        return {
          label: t("bookingStatus.returned"),
          color: "bg-orange-100 text-orange-800",
        };
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-primary">
          {t("profile.bookingHistory.title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("profile.bookingHistory.des")}</p>
        <div className="bg-white shadow-md rounded-xl p-6 border my-10">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex flex-col w-full ">
              <p className="mb-2">{t("search")}</p>
              <Input
                type="search"
                placeholder={t("search")}
                className="mb-4 w-full md:w-1/2"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
              />
            </div>
            <div className="flex flex-row gap-3">
              <div>
                <p className="mb-2">{t("bookingHistory.departureDate")}</p>
                <DatePicker
                  value={departureDate}
                  onChange={setDepartureDate}
                  className="mb-4"
                />
              </div>
              <div>
                <p className="mb-2">{t("bookingHistory.status")}</p>
                <Select
                  value={status}
                  onValueChange={(val) =>
                    setStatus(val as BookingStatus | "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      {status === "all"
                        ? t("all")
                        : t(
                            `bookingStatus.${toCamelCase(
                              status.toLocaleLowerCase()
                            )}`
                          )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"all"} className="p-1">
                      {t("all")}
                    </SelectItem>
                    <SelectItem value={BookingStatus.PAYED} className="p-1">
                      {/* add badge */}
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {t("bookingStatus.payed")}
                      </span>
                    </SelectItem>
                    <SelectItem value={BookingStatus.FAILED} className="p-1">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {t("bookingStatus.failed")}
                      </span>
                    </SelectItem>
                    <SelectItem
                      value={BookingStatus.WAIT_TO_PAY}
                      className="p-1"
                    >
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {t("bookingStatus.waitToPay")}
                      </span>
                    </SelectItem>
                    <SelectItem
                      value={BookingStatus.OUT_OF_PAY}
                      className="p-1"
                    >
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {t("bookingStatus.outOfPay")}
                      </span>
                    </SelectItem>
                    <SelectItem value={BookingStatus.RETURNED} className="p-1">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {t("bookingStatus.returned")}
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="min-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">
                    {t("bookingHistory.code")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("bookingHistory.route")}
                  </TableHead>
                  <TableHead>{t("bookingHistory.departureTime")}</TableHead>
                  <TableHead>{t("bookingHistory.numOfTickets")}</TableHead>
                  <TableHead>{t("bookingHistory.totalPrice")}</TableHead>
                  <TableHead>{t("bookingHistory.createdAt")}</TableHead>
                  <TableHead>{t("bookingHistory.status")}</TableHead>
                  <TableHead>{t("bookingHistory.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell className="text-primary">{item.code}</TableCell>
                    <TableCell>
                      {item.departureRoute +
                        (item?.returnRoute ? ` -> ${item.returnRoute}` : "")}
                    </TableCell>
                    <TableCell>
                      {formatToLocalDateTime(item.departureTime)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.numOfTickets}
                    </TableCell>
                    <TableCell className="text-center text-primary">
                      {formatCurrencyVND(item.totalPrice)}
                    </TableCell>
                    <TableCell>
                      {formatToLocalDateTimeWithTimeZone(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            StatusConverter(item.status).color
                          }`}
                        >
                          {StatusConverter(item.status).label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button className="mr-1">
                        <Link href={`/bookings/${item.code}`} target="_blank">
                          {t("details")}
                        </Link>
                      </Button>
                      {item.status === BookingStatus.PAYED &&
                        isAfterNow24h(item.departureTime) && (
                          <Button
                            className="cursor-pointer mr-1"
                            onClick={() => setSelected(item.code)}
                          >
                            {t("returnTicket")}
                          </Button>
                        )}
                      {item.status === BookingStatus.WAIT_TO_PAY &&
                        nowIsBefore20Min(item.createdAt) && (
                          <Button
                            className="cursor-pointer"
                            onClick={() =>
                              handlePay(item.code, item?.paymentLink || "")
                            }
                          >
                            {t("pay")}
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <CustomPagination
            currentPage={page}
            totalPages={totalPage}
            onPageChange={setPage}
          />
        </div>
      </div>
      <ReturnTicketModal
        open={selected}
        onOpenChange={setSelected}
        refetch={refetch}
      />
    </div>
  );
}
