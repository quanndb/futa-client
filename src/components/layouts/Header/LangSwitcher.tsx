"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectItem } from "@radix-ui/react-select";
import { useLocale } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const LangSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the path
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    // Construct the new path with the new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center cursor-pointer">
      <Select defaultValue={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger>
          <SelectValue>
            {locale === "vi" ? (
              <div className="flex items-center gap-2 text-white">
                <Image
                  src="/assets/images/vi.svg"
                  width={26}
                  height={26}
                  alt="VI"
                />
                <span>VI</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white">
                <Image
                  src="/assets/images/en.svg"
                  width={26}
                  height={26}
                  alt="EN"
                />
                <span>EN</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="flex flex-col gap-2">
            <SelectItem value="vi">
              <div className="flex items-center gap-2">
                <Image
                  src={`/assets/images/vi.svg`}
                  width={26}
                  height={26}
                  alt="Viet Nam Language Icon"
                />
                <span>VI</span>
              </div>
            </SelectItem>
            <SelectItem value="en">
              <div className="flex items-center gap-2">
                <Image
                  src={`/assets/images/en.svg`}
                  width={26}
                  height={26}
                  alt="English Language Icon"
                />
                <span>EN</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LangSwitcher;
