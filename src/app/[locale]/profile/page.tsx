"use client";
import AccountInfo from "@/app/[locale]/profile/AccountInfo";
import LogoutModal from "@/app/[locale]/profile/LogoutModal";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/lib/utils/authUtils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = ["futaPay", "accountInfo", "bookingHistory", "password", "logout"];

export default function Profile() {
  const t = useTranslations("profile");
  const [activeTab, setActiveTab] = useState(tabs[1]);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authStorage.getAccessToken() === null) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="layout w-full grid grid-cols-4 gap-5  my-20">
      <Card className="p-3 md:col-span-1 col-span-4 ">
        <div className="flex md:block">
          {tabs.map((tab, idx) => (
            <div
              key={tab}
              className={`w-full items-center flex flex-col md:flex-row gap-3 px-5 py-3 cursor-pointer hover:bg-red-50 rounded-md ${
                activeTab === tab ? "bg-red-50" : ""
              }`}
              onClick={() => {
                if (tab === "logout") {
                  setLogoutModalOpen(true);
                } else {
                  setActiveTab(tab);
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
      <Card className="w-full md:col-span-3 col-span-4">
        <div className="p-3">
          {activeTab === "futaPay" && <p>{t("futaPay")}</p>}
          {activeTab === "accountInfo" && <AccountInfo />}
          {activeTab === "bookingHistory" && <p>{t("bookingHistory")}</p>}
          {activeTab === "password" && <p>{t("password")}</p>}
        </div>
      </Card>
      <LogoutModal open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </div>
  );
}
