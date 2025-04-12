"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Schedule", href: "/schedule" },
  { label: "Bookings", href: "/bookings" },
  { label: "Contact", href: "/contact" },
  { label: "About Us", href: "/about" },
];

const Navbar = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <nav className={cn(" sticky z-50 w-full", className)}>
      <div className=" px-4 py-3 flex justify-between items-center">
        <div className="flex w-full ">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group text-white 
                font-medium flex-1 text-center p-4"
                // hover:text-white-500 transition duration-200
              >
                <span className="">
                  {item.label}
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
