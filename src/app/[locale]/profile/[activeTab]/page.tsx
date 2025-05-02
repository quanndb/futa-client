"use client";
import AccountInfo from "@/app/[locale]/profile/AccountInfo";
import BookingHistory from "@/app/[locale]/profile/BookingHistory";
import ChangePassword from "@/app/[locale]/profile/ChangePassword";
import FutaWallet from "@/app/[locale]/profile/FutaWallet";
import LogoutModal from "@/app/[locale]/profile/LogoutModal";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/lib/utils/authUtils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

enum tabEnum {
  FUTA_PAY = "futaPay",
  ACCOUNT_INFO = "accountInfo",
  BOOKING_HISTORY = "bookingHistory",
  PASSWORD = "password",
  LOGOUT = "logout",
}

export default function Profile({
  params,
}: {
  params: Promise<{ activeTab: string }>;
}) {
  const { activeTab } = use(params);
  const t = useTranslations("profile");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authStorage.getAccessToken() === null) {
      router.push("/login");
    }
  }, [router, activeTab]);

  return (
    <div className="layout w-full grid grid-cols-4 gap-5  my-20">
      <Card className="p-3 md:col-span-1 col-span-4 md:min-h-[500px]">
        <div className="flex md:block">
          {Object.values(tabEnum).map((tab, idx) => (
            <div
              key={tab}
              className={`w-full items-center flex flex-col md:flex-row gap-3 px-5 py-3 cursor-pointer hover:bg-red-50 rounded-md ${
                activeTab === tab ? "bg-red-50" : ""
              }`}
              onClick={() => {
                if (tab === tabEnum.LOGOUT) {
                  setLogoutModalOpen(true);
                } else {
                  router.push(tab);
                }
              }}
            >
              <Image
                src={`/assets/images/p${idx + 1}.svg`}
                alt={t(`tabs.${tab}`)}
                width={32}
                height={32}
                className="h-[32px] w-[32px]"
              />
              <span className="text-sm font-medium text-center md:text-left">
                {t("tabs." + tab)}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="w-full md:col-span-3 col-span-4 p-3">
        <div className="p-3">
          {activeTab === tabEnum.FUTA_PAY && <FutaWallet />}
          {activeTab === tabEnum.ACCOUNT_INFO && <AccountInfo />}
          {activeTab === tabEnum.BOOKING_HISTORY && <BookingHistory />}
          {activeTab === tabEnum.PASSWORD && <ChangePassword />}
        </div>
      </Card>
      <LogoutModal open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </div>
  );
}
