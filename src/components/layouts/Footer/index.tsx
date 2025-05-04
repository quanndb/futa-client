import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mx-auto w-full bg-[#FFF7F5] text-[15px] block">
      <div className="p-4 sm:pt-12">
        <div className="layout flex flex-wrap gap-4 font-normal text-black lg:gap-14">
          <div className="flex max-w-[34rem] flex-col">
            <div className="flex w-full max-w-md justify-between">
              <div className="">
                <p className="text-secondary font-medium uppercase">
                  {t("bookingCenterAndCustomerCare")}
                </p>
                <Link
                  href="tel:19006067"
                  className="text-3xl font-medium text-primary"
                >
                  1900 6067
                </Link>
              </div>
              <Link
                target="_blank"
                href="http://online.gov.vn/Home/WebDetails/14029"
              >
                <div className="relative h-[60px] w-40">
                  <Image
                    alt=""
                    loading="lazy"
                    decoding="async"
                    data-nimg="fill"
                    width={160}
                    height={60}
                    className="transition-all duration-200 relative h-[60px] w-40"
                    src="https://cdn.futabus.vn/futa-busline-cms-dev/logo_Sale_Noti_7dab1d54a1/logo_Sale_Noti_7dab1d54a1.png"
                  />
                </div>
              </Link>
            </div>
            <span className="text-secondary mt-5 font-medium uppercase">
              {t("futaJSC")}
            </span>
            <span className="text-gray mt-2 sm:mt-1">
              <span className="text-black">{t("address")}</span>
            </span>
            <span className="text-gray mt-2 sm:mt-1">
              Email:{" "}
              <Link href="mailto:hotro@futa.vn" className="text-primary">
                hotro@futa.vn
              </Link>
            </span>
            <div className="mt-[10px] flex w-full max-w-md justify-between sm:mt-1">
              <span className="text-gray">
                {t("phoneNumber")}:{" "}
                <Link href="tel:02838386852" className="text-black">
                  02838386852
                </Link>
              </span>
              <span className="text-gray mr-px">
                Fax:{" "}
                <Link href="tel:02838386853" className="text-black">
                  02838386853
                </Link>
              </span>
            </div>
            <div className="mb-4 mt-5 flex w-full max-w-md justify-between">
              <div className="text-secondary font-medium uppercase">
                {t("downloadApp")}
                <div className="mt-2 flex gap-4">
                  <Link
                    target="_blank"
                    className="relative"
                    href="http://onelink.to/futa.android"
                  >
                    <div className="relative min-h-[24px] w-[86px] object-cover">
                      <Image
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={86}
                        height={24}
                        className="transition-all duration-200 relative min-h-[24px] w-[86px] object-cover h-auto"
                        src="https://cdn.futabus.vn/futa-busline-cms-dev/CH_Play_712783c88a/CH_Play_712783c88a.svg"
                      />
                    </div>
                  </Link>
                  <Link
                    target="_blank"
                    className="relative"
                    href="http://onelink.to/futa.ios"
                  >
                    <div className="relative min-h-[24px] w-[86px] object-cover">
                      <Image
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={86}
                        height={24}
                        className="transition-all duration-200 relative min-h-[24px] w-[86px] object-cover h-auto"
                        src="https://cdn.futabus.vn/futa-busline-cms-dev/App_Store_60da92cb12/App_Store_60da92cb12.svg"
                      />
                    </div>
                  </Link>
                </div>
              </div>
              <div className="text-secondary font-medium uppercase">
                {t("connectWithUs")}
                <div className="mt-2 flex gap-4">
                  <Link
                    target="_blank"
                    href="https://www.facebook.com/xephuongtrang"
                    rel="noreferrer"
                  >
                    <div className="">
                      <Image
                        alt=""
                        loading="lazy"
                        width={27}
                        height={27}
                        decoding="async"
                        data-nimg="1"
                        className="transition-all duration-200 w-auto h-auto"
                        src="https://cdn.futabus.vn/futa-busline-cms-dev/facebook_1830e1b97c/facebook_1830e1b97c.svg"
                      />
                    </div>
                  </Link>
                  <Link
                    target="_blank"
                    href="https://www.youtube.com/channel/UCs32uT002InnxFnfXCRN48A?view_as=subscriber"
                    rel="noreferrer"
                  >
                    <div className="">
                      <Image
                        alt=""
                        loading="lazy"
                        width={27}
                        height={27}
                        decoding="async"
                        data-nimg="1"
                        className="transition-all duration-200 w-auto h-auto"
                        src="https://cdn.futabus.vn/futa-busline-cms-dev/youtube_d5ef476c0e/youtube_d5ef476c0e.svg"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden max-w-lg flex-col gap-4 sm:flex sm:flex-row">
            <div className="flex flex-col">
              <div className="text-secondary h-4 font-medium">
                FUTA Bus Lines
              </div>
              <div className="mt-1 flex max-w-md flex-col">
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link href="/ve-chung-toi" target="_self" rel="noreferrer">
                    {t("aboutUs")}
                  </Link>
                </div>
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link href="/lich-trinh" target="_self" rel="noreferrer">
                    {t("schedule")}
                  </Link>
                </div>
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link
                    href="https://vieclam.futabus.vn/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("recruitment")}
                  </Link>
                </div>
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link href="/tin-tuc" target="_self" rel="noreferrer">
                    {t("newsAndEvents")}
                  </Link>
                </div>
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link
                    href="/danh-sach-chi-nhanh"
                    target="_self"
                    rel="noreferrer"
                  >
                    {t("officeNetwork")}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-secondary h-4 font-medium">
                {t("support")}
              </div>
              <div className="mt-1 flex max-w-md flex-col">
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link href="/tra-cuu-ve" target="_self" rel="noreferrer">
                    {t("manageBooking")}
                  </Link>
                </div>
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link
                    href="/dieu-khoan-su-dung"
                    target="_self"
                    rel="noreferrer"
                  >
                    {t("termsOfService")}
                  </Link>
                </div>
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link href="/hoi-dap" target="_self" rel="noreferrer">
                    {t("faq")}
                  </Link>
                </div>
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link
                    href="/huong-dan-dat-ve-tren-web"
                    target="_self"
                    rel="noreferrer"
                  >
                    {t("bookingGuideWeb")}
                  </Link>
                </div>
                <div className="mt-3 flex min-w-[140px] max-w-[200px] items-center">
                  <div className="border-rad mr-3 h-2 w-2 rounded-full bg-gray-300"></div>
                  <Link
                    href="/huong-dan-nap-tien-tren-app"
                    target="_self"
                    rel="noreferrer"
                  >
                    {t("bookingGuideApp")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="layout mb-6 grid grid-cols-2 gap-6 sm:mb-10 sm:flex sm:flex-wrap sm:justify-center">
        <Link target="_blank" className="flex-1" href="https://futabus.vn/">
          <div className="aspect-[6/1] relative w-full">
            <Image
              alt=""
              loading="lazy"
              decoding="async"
              data-nimg="fill"
              width={600}
              height={100}
              className="transition-all duration-200 aspect-[6/1] relative w-full"
              src="https://cdn.futabus.vn/futa-busline-cms-dev/Bus_Lines_817c989817/Bus_Lines_817c989817.svg"
            />
          </div>
        </Link>
        <Link target="_blank" className="flex-1" href="https://futaexpress.vn">
          <div className="aspect-[6/1] relative w-full">
            <Image
              alt=""
              loading="lazy"
              decoding="async"
              data-nimg="fill"
              width={600}
              height={100}
              className="transition-all duration-200 aspect-[6/1] relative w-full"
              src="https://cdn.futabus.vn/futa-busline-cms-dev/logo_futa_express_0ad93b22d3/logo_futa_express_0ad93b22d3.svg"
            />
          </div>
        </Link>
        <Link target="_blank" className="flex-1" href="https://futaads.vn/">
          <div className="aspect-[6/1] relative w-full">
            <Image
              alt=""
              loading="lazy"
              decoding="async"
              data-nimg="fill"
              width={600}
              height={100}
              className="transition-all duration-200 aspect-[6/1] relative w-full"
              src="https://cdn.futabus.vn/futa-busline-cms-dev/FUTA_Advertising_d0b60b3a45/FUTA_Advertising_d0b60b3a45.svg"
            />
          </div>
        </Link>
        <Link
          target="_blank"
          className="flex-1"
          href="https://futabus.vn/tin-tuc/tram-dung-chan-5-sao"
        >
          <div className="aspect-[6/1] relative w-full">
            <Image
              alt=""
              loading="lazy"
              decoding="async"
              data-nimg="fill"
              width={600}
              height={100}
              className="transition-all duration-200 aspect-[6/1] relative w-full"
              src="https://cdn.futabus.vn/futa-busline-web-cms-prod/Tdcpl_1_5d2e395adc/Tdcpl_1_5d2e395adc.png"
            />
          </div>
        </Link>
      </div>
      <div className="flex min-h-[40px] flex-col items-center justify-center bg-[#00613D] py-2 text-center text-white sm:flex-row">
        <span>{t("copyRight")}</span>
      </div>
    </footer>
  );
}
