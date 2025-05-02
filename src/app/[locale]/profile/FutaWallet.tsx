import WalletCommand from "@/app/[locale]/profile/WalletCommand";
import WalletHistory from "@/app/[locale]/profile/WalletHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatCurrencyVND } from "@/lib/utils/CurrencyFormater";
import walletAPI from "@/services/API/walletAPI";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

enum WalletTab {
  WALLET_HISTORY = "walletHistory",
  WALLET_COMMAND = "walletCommand",
}

export default function FutaWallet() {
  const t = useTranslations();
  const [tab, setTab] = useState<WalletTab>(WalletTab.WALLET_HISTORY);

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => walletAPI.getMyWallet(),
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-primary">
          {t("profile.futaWallet.title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("profile.futaWallet.des")}</p>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 border mb-10">
        <p className="text-xl font-bold text-primary">
          {t("profile.futaWallet.balance")}:
          <span className="ml-2 text-black">
            {formatCurrencyVND(wallet?.data?.currentBalance || 0)}
          </span>
        </p>
      </div>
      <Tabs
        value={tab}
        onValueChange={(tab) => setTab(tab as WalletTab)}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value={WalletTab.WALLET_HISTORY} className="p-0">
            <div
              className={cn(
                tab === WalletTab.WALLET_HISTORY
                  ? "bg-primary text-white rounded-lg shadow-md"
                  : "",
                "w-full text-left px-3 flex items-center py-2 transition-all duration-300 "
              )}
            >
              <p>{t("profile.futaWallet.walletHistory")}</p>
            </div>
          </TabsTrigger>
          <TabsTrigger value={WalletTab.WALLET_COMMAND} className="p-0">
            <div
              className={cn(
                tab === WalletTab.WALLET_COMMAND
                  ? "bg-primary text-white rounded-lg shadow-md"
                  : "",
                "w-full text-left px-3 flex items-center py-2 transition-all duration-300 "
              )}
            >
              <p>{t("profile.futaWallet.walletCommand")}</p>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={WalletTab.WALLET_HISTORY}>
          <WalletHistory />
        </TabsContent>
        <TabsContent value={WalletTab.WALLET_COMMAND}>
          <WalletCommand />
        </TabsContent>
      </Tabs>
    </div>
  );
}
