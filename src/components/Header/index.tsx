"use client";

import Link from "next/link";
import Image from "next/image";
import LoginForm from "../Login";
import TicketBookingPage from "../TicketBooking";

interface HeaderProps {
  isLogin?: boolean;
}

const Header = ({ isLogin = false }: HeaderProps) => {
  return (
    <header
      className="relative w-full text-sm shadow-md  bg-cover bg-center min-h-56 bg-[url('/assets/images/home_banner.png')]
"
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 pb-3">
        {/* Left Side */}
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center cursor-pointer">
            <Image
              src={"/assets/images/vietnam.svg"}
              width={26}
              height={26}
              alt="Language Icon"
            />
            <span className="mx-2 uppercase text-gray-700">VI</span>
          </div>
          <div className="border-l pl-4 flex items-center cursor-pointer">
            <Image
              src={"/assets/images/download_app.svg"}
              width={26}
              height={26}
              alt="Download App"
            />
            <span className="mx-2 text-gray-700">Download App</span>
          </div>
        </div>

        {/* Logo */}
        <div className="flex-1 text-center">
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

        {/* Right Side - Sign In */}
        <div className="flex items-center justify-end flex-1">
          <Link href={"/login"}>
            <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-full">
              <Image
                src={"/assets/images/person.svg"}
                width={20}
                height={20}
                alt="Person"
              />
              <span>Sign In/Sign Out</span>
            </button>
          </Link>
        </div>
      </div>

      {isLogin && (
        <LoginForm className="absolute left-1/2 transform -translate-x-1/2 w-full mt-12  max-w-6xl" />
      )}
      {!isLogin && (
        <TicketBookingPage className="absolute left-1/2 transform -translate-x-1/2 w-full mt-12  max-w-6xl" />
      )}
    </header>
  );
};

export default Header;
