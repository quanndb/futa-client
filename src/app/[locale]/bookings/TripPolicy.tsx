"use client";

import {
  AlertTriangle,
  Baby,
  Bus,
  LucideProps,
  Luggage,
  Phone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
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

export default function TripPolicy() {
  const t = useTranslations("TripPolicy");

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl h-full overflow-auto border-2">
      <Section icon={AlertTriangle} title={t("cancellationPolicy.title")}>
        <li>{t("cancellationPolicy.exchangeOnce")}</li>
        <li>{t("cancellationPolicy.costExplanation")}</li>
        <li>{t("cancellationPolicy.contactInstruction")}</li>
      </Section>

      <Section icon={Bus} title={t("boarding.title")}>
        <li>{t("boarding.arrivalTime")}</li>
        <li>{t("boarding.presentTicket")}</li>
        <li>{t("boarding.noStrongOdors")}</li>
        <li>{t("boarding.noSmokingAlcohol")}</li>
        <li>{t("boarding.noFlammableItems")}</li>
        <li>{t("boarding.noLittering")}</li>
        <li>{t("boarding.noPets")}</li>
      </Section>

      <Section icon={Luggage} title={t("baggage.title")}>
        <li>{t("baggage.maxWeight")}</li>
        <li>{t("baggage.noBulkyGoods")}</li>
      </Section>

      <Section icon={Baby} title={t("childrenPregnant.title")}>
        <li>{t("childrenPregnant.childTicketPolicy")}</li>
        <li>{t("childrenPregnant.maxOneChild")}</li>
        <li>{t("childrenPregnant.pregnantCaution")}</li>
      </Section>

      <Section icon={Phone} title={t("pickup.title")}>
        <li>{t("pickup.registerPickup")}</li>
        <li>{t("pickup.pickupLocationNote")}</li>
      </Section>
    </div>
  );
}
