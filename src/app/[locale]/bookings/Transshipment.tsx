"use client";

import { Clock4, MapPin, MapPinOff, Package, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <section>
      <div className="flex items-center mb-2">
        <Icon className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
        {children}
      </ul>
    </section>
    <hr className="my-5" />
  </div>
);

export default function Transshipment() {
  const t = useTranslations("Transshipment");

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl h-fit border-2">
      <Section icon={Truck} title={t("title")}>
        <li>
          <Clock4 className="inline-block w-4 h-4 mr-1 text-primary" />
          {t("guestTime")}
        </li>
        <li>
          <Clock4 className="inline-block w-4 h-4 mr-1 text-primary" />
          {t("pickupTime")}
        </li>
        <li>
          <MapPinOff className="inline-block w-4 h-4 mr-1 text-primary" />
          {t("smallAlleys")}
        </li>
        <li>
          <MapPin className="inline-block w-4 h-4 mr-1 text-primary" />
          {t("noParking")}
        </li>
        <li>
          <Package className="inline-block w-4 h-4 mr-1 text-primary" />
          {t("luggage")}
        </li>
      </Section>
    </div>
  );
}
