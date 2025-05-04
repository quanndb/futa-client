import DepositModal from "@/app/[locale]/profile/DepositModal";
import WithdrawModal from "@/app/[locale]/profile/WithdrawModal";
import SelectOptions, { Option } from "@/components/common/SelectOptions";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/ui/customPagination";
import { DatePicker } from "@/components/ui/datePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import walletAPI, {
  WalletAction,
  WalletCommandStatus,
} from "@/services/API/walletAPI";
import { useUserInfo } from "@/store/AuthStore";
import { useLoading } from "@/store/LoadingStore";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function WalletCommand() {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<Option>({ label: "all", value: "all" });
  const [action, setAction] = useState<Option>({ label: "all", value: "all" });
  const [transactionDate, setTransactionDate] = useState<string | undefined>(
    ""
  );
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const { userInfo } = useUserInfo();
  const { setIsLoading } = useLoading();

  const { data: walletCommands } = useQuery({
    queryKey: [
      "wallet-commands",
      page,
      keyword,
      transactionDate,
      status,
      action,
    ],
    queryFn: () => {
      setIsLoading(true);
      return walletAPI
        .getMyWalletCommands({
          pageSize: 10,
          pageIndex: page,
          keyword,
          transactionDate,
          statuses:
            status.value === "all"
              ? undefined
              : ([status.value] as WalletCommandStatus[]),
          actions:
            action.value === "all"
              ? undefined
              : ([action.value] as WalletAction[]),
        })
        .finally(() => setIsLoading(false));
    },
  });

  const totalPage = Math.ceil(
    (walletCommands?.page.total || 1) / (walletCommands?.page.pageSize || 1)
  );

  const ActionConverter = (action: WalletAction) => {
    switch (action) {
      case WalletAction.DEPOSIT:
        return {
          label: t("walletAction.deposit"),
          color: "bg-green-100 text-green-800",
        };
      case WalletAction.WITHDRAW:
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
      default:
        return {
          label: t("walletAction.deposit"),
          color: "bg-green-100 text-green-800",
        };
    }
  };

  const StatusConverter = (status: string) => {
    switch (status) {
      case "WAIT_TO_RESOLVE":
        return {
          label: t("walletCommand.statuses.wait_to_resolve"),
          color: "bg-yellow-100 text-yellow-800",
        };
      case "WAIT_TO_PAY":
        return {
          label: t("walletCommand.statuses.wait_to_pay"),
          color: "bg-blue-100 text-blue-800",
        };
      case "REJECTED":
        return {
          label: t("walletCommand.statuses.rejected"),
          color: "bg-red-100 text-red-800",
        };
      case "SUCCESS":
        return {
          label: t("walletCommand.statuses.success"),
          color: "bg-green-100 text-green-800",
        };
      case "RETURNED":
        return {
          label: t("walletCommand.statuses.returned"),
          color: "bg-orange-100 text-orange-800",
        };
      default:
        return {
          label: t("walletCommand.statuses.wait_to_resolve"),
          color: "bg-yellow-100 text-yellow-800",
        };
    }
  };

  return (
    <div>
      <div className="min-h-[450px] overflow-x-auto mt-5">
        <Button onClick={() => setDepositModalOpen(true)} className="mb-5 mr-2">
          {t("deposit")}
        </Button>
        <Button onClick={() => setWithdrawModalOpen(true)} className="mb-5">
          {t("withdraw")}
        </Button>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full">
            <Label className="mb-2">{t("search")}</Label>
            <Input
              type="search"
              placeholder={t("search")}
              className="mb-4 w-full md:w-1/2"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
            />
          </div>
          <div className="flex gap-5">
            <div>
              <Label className="mb-2">{t("createdDate")}</Label>
              <DatePicker
                value={transactionDate}
                onChange={setTransactionDate}
                className="mb-4"
                placeholder={t("walletCommand.selectCreatedDate")}
              />
            </div>
            <div>
              <Label className="mb-2">{t("action")}</Label>
              <SelectOptions
                selectedOption={action}
                onChangeOption={setAction}
                options={Object.values(WalletAction).map((value) => ({
                  label: t(
                    `walletCommand.actions.${value.toLocaleLowerCase()}`
                  ),
                  value,
                }))}
              />
            </div>
            <div>
              <Label className="mb-2">{t("status")}</Label>
              <SelectOptions
                selectedOption={status}
                onChangeOption={setStatus}
                options={Object.values(WalletCommandStatus).map((value) => ({
                  label: t(
                    `walletCommand.statuses.${value.toLocaleLowerCase()}`
                  ),
                  value,
                }))}
              />
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 text-gray-700">
              <TableHead className="text-center">
                {t("walletCommand.code")}
              </TableHead>
              <TableHead className="text-center">
                {t("walletCommand.bank")}
              </TableHead>
              <TableHead>{t("walletCommand.accountNumber")}</TableHead>
              <TableHead className="text-center">
                {t("walletCommand.receiver")}
              </TableHead>
              <TableHead className="text-center">
                {t("walletCommand.amount")}
              </TableHead>
              <TableHead className="text-center">
                {t("walletCommand.createdAt")}
              </TableHead>
              <TableHead className="text-center">
                {t("walletCommand.completedAt")}
              </TableHead>
              <TableHead className="text-center">
                {t("walletCommand.action")}
              </TableHead>
              <TableHead className="text-center">
                {t("walletCommand.status")}
              </TableHead>
              <TableHead className="text-center">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {walletCommands?.data.map((walletCommand) => (
              <TableRow key={walletCommand.id}>
                <TableCell className="text-center text-primary">
                  {walletCommand.code}
                </TableCell>
                <TableCell className="text-center">
                  {walletCommand.bankCode}
                </TableCell>
                <TableCell>{walletCommand.accountNumber}</TableCell>
                <TableCell>{walletCommand.receiverName}</TableCell>
                <TableCell className="text-center text-primary">
                  {formatCurrencyVND(walletCommand.amount)}
                </TableCell>
                <TableCell className="text-center">
                  {formatToLocalDateTime(walletCommand.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  {walletCommand?.handledAt &&
                    formatToLocalDateTime(walletCommand.handledAt)}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-3 py-1 rounded-lg ${
                      ActionConverter(walletCommand.action).color
                    }`}
                  >
                    {ActionConverter(walletCommand.action).label}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-3 py-1 rounded-lg ${
                      StatusConverter(walletCommand.status).color
                    }`}
                  >
                    {StatusConverter(walletCommand.status).label}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {walletCommand.action === WalletAction.DEPOSIT &&
                    walletCommand.status === WalletCommandStatus.WAIT_TO_PAY &&
                    walletCommand?.handlerId === userInfo?.sub && (
                      <Button
                        onClick={() => {
                          if (walletCommand?.paymentLink) {
                            window.open(walletCommand.paymentLink, "_blank");
                          }
                        }}
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
        onPageChange={setPage}
        totalPages={totalPage}
      />
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
      />
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />
    </div>
  );
}
