"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import Image from "next/image";

const DowloadAppBtn = () => {
  const t = useTranslations();

  const downloadApp = (os: string) => {
    if (os === "android") {
      window.open(
        "https://play.google.com/store/apps/details?id=client.facecar.com",
        "_blank"
      );
    }
    if (os === "ios") {
      window.open("https://apps.apple.com/vn/app/futa/id1126633800", "_blank");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="border-l pl-4 flex items-center cursor-pointer">
          <Image
            src={"/assets/images/download_app.svg"}
            width={26}
            height={26}
            alt="Download App"
          />
          <span className="mx-2 text-white">{t("downloadApp")}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup onValueChange={downloadApp}>
          <DropdownMenuRadioItem value="android" className="px-2">
            ANDROID
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ios" className="px-2">
            IOS
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DowloadAppBtn;
