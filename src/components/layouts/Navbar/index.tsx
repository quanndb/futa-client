"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "home", href: "/" },
  { label: "schedule", href: "/schedule" },
  { label: "booking", href: "/bookings" },
  { label: "contact", href: "/contact" },
  { label: "about", href: "/about" },
];

const Navbar = ({ className }: { className?: string }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <nav className={cn(" sticky z-50 w-full", className)}>
      <div className=" px-4 py-3 flex justify-between items-center">
        <div className="flex w-full ">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/" || pathname === `/${locale}`
                : pathname.split("/")[2] === item.href.slice(1);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group text-white 
                font-medium flex-1 text-center p-4"
                // hover:text-white-500 transition duration-200
              >
                <span className="">
                  <span>{t(`nav.${item.label}`)}</span>
                  <span
                    className={cn(
                      "block h-[2px] transition-all duration-300",
                      isActive ? "max-w-full bg-white" : "max-w-0 "
                    )}
                  ></span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
