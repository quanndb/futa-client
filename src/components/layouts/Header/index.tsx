"use client";

import DowloadAppBtn from "@/components/layouts/Header/DowloadAppBtn";
import LangSwitcher from "@/components/layouts/Header/LangSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarEncoder } from "@/lib/utils/LinkConverter";
import { useUserInfo } from "@/store/AuthStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const t = useTranslations();
  const { userInfo } = useUserInfo();

  return (
    <header className="w-full text-sm shadow-md bg-cover bg-center min-h-52 bg-[url('/assets/images/home_banner.png')]">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 pb-3">
        <div className="flex items-center gap-6 flex-1">
          <LangSwitcher />
          <DowloadAppBtn className="hidden md:block" />
        </div>
        <div className="flex-1 text-center self-start">
          <Link href="/">
            <Image
              src={"/assets/images/logo_new.svg"}
              width={295}
              height={60}
              alt="Logo"
              className="mx-auto"
            />
          </Link>
        </div>
        <div className="flex items-center justify-end flex-1">
          {userInfo ? (
            <Link href="/profile">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={avatarEncoder(userInfo?.avatar)}
                    className="object-cover"
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                <p className="hidden md:block text-white font-bold">
                  {userInfo.full_name}
                </p>
              </div>
            </Link>
          ) : (
            <Link href={"/login"}>
              <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-full cursor-pointer">
                <Image
                  src={"/assets/images/person.svg"}
                  width={20}
                  height={20}
                  alt="Person"
                />
                <span className="hidden md:block">{t("signInOut")}</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
