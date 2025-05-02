import { CustomPagination } from "@/components/ui/customPagination";
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
import walletAPI from "@/services/API/walletAPI";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function WalletCommand() {
  const t = useTranslations();
  const [page, setPage] = useState(1);

  const { data: walletCommands } = useQuery({
    queryKey: ["wallet-commands", page],
    queryFn: () =>
      walletAPI.getMyWalletCommands({ pageSize: 10, pageIndex: page }),
  });

  const totalPage = Math.ceil(
    (walletCommands?.page.total || 1) / (walletCommands?.page.pageSize || 1)
  );

  return (
    <div>
      <div className="min-h-[450px] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 text-gray-700">
              <TableHead className="text-center">
                {t("walletHistory.code")}
              </TableHead>
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
            {walletCommands?.data.map((walletCommand, index) => (
              <TableRow key={walletCommand.id}>
                <TableCell className="text-center">
                  {walletCommand.code}
                </TableCell>
                <TableCell>{walletCommand.bankCode}</TableCell>
                <TableCell>{walletCommand.accountNumber}</TableCell>
                <TableCell>{walletCommand.receiverName}</TableCell>
                <TableCell className="text-center">
                  {formatCurrencyVND(walletCommand.amount)}
                </TableCell>
                <TableCell>
                  {formatToLocalDateTime(walletCommand.createdAt)}
                </TableCell>
                <TableCell>
                  {formatToLocalDateTime(walletCommand.handledAt || "")}
                </TableCell>
                <TableCell>{walletCommand.action}</TableCell>
                <TableCell className="text-center">
                  {walletCommand.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CustomPagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPage}
        />
      </div>
    </div>
  );
}
