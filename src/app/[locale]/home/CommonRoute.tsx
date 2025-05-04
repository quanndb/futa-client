import { useTranslations } from "next-intl";
import Image from "next/image";

export default function CommonRoute() {
  const t = useTranslations();

  const departureData = [
    {
      departure: "Tp Hồ Chí Minh",
      image: "hcm.png",
      destinations: [
        {
          name: "Đà Lạt",
          distance: "305km",
          duration: `8 ${t("common.hour")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "290.000đ",
        },
        {
          name: "Cần Thơ",
          distance: "166km",
          duration: `5 ${t("common.hour")} 30 ${t("common.min")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "165.000đ",
        },
        {
          name: "Long Xuyên",
          distance: "203km",
          duration: `5 ${t("common.hour")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "190.000đ",
        },
      ],
    },
    {
      departure: "Đà Lạt",
      image: "dalat.png",
      destinations: [
        {
          name: "TP. Hồ Chí Minh",
          distance: "310km",
          duration: `8 ${t("common.hour")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "290.000đ",
        },
        {
          name: "Đà Nẵng",
          distance: "757km",
          duration: `17 ${t("common.hour")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "410.000đ",
        },
        {
          name: "Cần Thơ",
          distance: "457km",
          duration: `11 ${t("common.hour")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "435.000đ",
        },
      ],
    },
    {
      departure: "Đà Nẵng",
      image: "danang.png",
      destinations: [
        {
          name: "Đà Lạt",
          distance: "666km",
          duration: `17 ${t("common.hour")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "410.000đ",
        },
        {
          name: "BX An Sương",
          distance: "966km",
          duration: `20 ${t("common.hour")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "470.000đ",
        },
        {
          name: "Nha Trang",
          distance: "528km",
          duration: `9 ${t("common.hour")} 25 ${t("common.min")}`,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/"),
          price: "370.000đ",
        },
      ],
    },
  ];

  return (
    <div className="py-10 layout">
      <h2 className="text-3xl text-secondary uppercase font-bold text-center">
        {t("home.commonRoute")}
      </h2>
      <p className="text-center py-2 text-xl">{t("home.trustAndChosen")}</p>
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {departureData.map((item) => (
          <div
            key={item.departure}
            className="bg-white rounded-xl shadow-md overflow-hidden w-[80%] lg:w-[350px] flex flex-col"
          >
            {/* Image header with overlay */}
            <div className="h-36 relative">
              <Image
                src={`/assets/images/${item.image}`}
                alt={item.departure}
                width={300}
                height={100}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-end p-4">
                <span className="text-white text-sm">Departure from</span>
                <span className="text-white text-xl font-bold">
                  {item.departure}
                </span>
              </div>
            </div>
            {/* Destinations */}
            <div className="flex-1 flex flex-col">
              {item.destinations.map((destination, idx) => (
                <div
                  key={destination.name}
                  className={`flex justify-between items-center px-6 py-4 ${
                    idx !== item.destinations.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div>
                    <div className="font-semibold text-secondary">
                      {destination.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {destination.distance} - {destination.duration} -{" "}
                      {destination.date}
                    </div>
                  </div>
                  <div className="font-semibold text-black">
                    {destination.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
