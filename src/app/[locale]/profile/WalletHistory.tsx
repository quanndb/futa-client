import { CustomPagination } from "@/components/ui/customPagination";
import { DatePicker } from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyVND } from "@/lib/utils/CurrencyFormater";
import { formatToLocalDateTime } from "@/lib/utils/DateConverter";
import walletAPI, { WalletAction } from "@/services/API/walletAPI";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

const WalletHistory = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [transactionDate, setTransactionDate] = useState<string | undefined>(
    ""
  );
  const t = useTranslations();

  const { data } = useQuery({
    queryKey: ["wallet-history", page, keyword, transactionDate],
    queryFn: () =>
      walletAPI.getMyWalletHistory({
        pageSize: 10,
        pageIndex: page,
        keyword,
        transactionDate,
      }),
  });

  const totalPage = Math.ceil(
    (data?.page.total || 1) / (data?.page.pageSize || 1)
  );

  const ActionConverter = (action: WalletAction) => {
    switch (action) {
      case WalletAction.DEPOSIT:
        return {
          label: t("walletAction.deposit"),
          color: "bg-green-100 text-green-800",
        };
      case WalletAction.WITH_DRAW:
        return {
          label: t("walletAction.withdraw"),
          color: "bg-red-100 text-red-800",
        };
      case WalletAction.USING:
        return {
          label: t("walletAction.using"),
          color: "bg-blue-100 text-blue-800",
        };
      case WalletAction.RETURN:
        return {
          label: t("walletAction.return"),
          color: "bg-yellow-100 text-yellow-800",
        };
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border">
      <h2 className="text-xl font-semibold text-primary mb-4">
        {t("profile.futaWallet.walletHistory")}
      </h2>
      <div className="flex flex-col md:flex-row justify-between">
        <Input
          type="search"
          placeholder={t("search")}
          className="mb-4 w-full md:w-1/2"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
        <DatePicker
          value={transactionDate}
          onChange={setTransactionDate}
          className="mb-4"
        />
      </div>
      <div className="min-h-[450px] overflow-x-auto">
        <Table className="w-full text-sm border rounded-md overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-100 text-gray-700">
              <TableHead className="text-center">#</TableHead>
              <TableHead>{t("walletHistory.bank")}</TableHead>
              <TableHead>{t("walletHistory.accountNumber")}</TableHead>
              <TableHead>{t("walletHistory.receiver")}</TableHead>
              <TableHead className="text-center">
                {t("walletHistory.amount")}
              </TableHead>
              <TableHead>{t("walletHistory.content")}</TableHead>
              <TableHead>{t("walletHistory.time")}</TableHead>
              <TableHead className="text-center">
                {t("walletHistory.balance")}
              </TableHead>
              <TableHead>{t("walletHistory.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((item, index) => (
              <TableRow key={item.id} className="even:bg-gray-50">
                <TableCell className="text-center font-medium text-primary">
                  {index + 1}
                </TableCell>
                <TableCell>{item.bankCode}</TableCell>
                <TableCell>{item.accountNumber}</TableCell>
                <TableCell>{item.receiverName}</TableCell>
                <TableCell className="text-center text-primary">
                  {formatCurrencyVND(item.amount)}
                </TableCell>
                <TableCell>{item.content}</TableCell>
                <TableCell>{formatToLocalDateTime(item.createdAt)}</TableCell>
                <TableCell className="text-center text-primary">
                  {formatCurrencyVND(item.currenBalance)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      ActionConverter(item.action).color
                    }`}
                  >
                    {ActionConverter(item.action).label}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6">
        <CustomPagination
          totalPages={totalPage}
          currentPage={data?.page.pageIndex || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default WalletHistory;
