import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <div className="layout grid grid-cols-1 md:grid-cols-3 gap-10 w-[100%] justify-self-start justify-between my-20">
      <div className="col-span-1 text-left flex flex-col">
        <h2 className="text-3xl text-secondary uppercase font-bold text-center">
          {t("title")}
        </h2>
        <p className="py-2 text-xl text-primary font-bold text-center">
          {t("JSC")}
        </p>
        <p className="py-2 text-xl">{t("website")}</p>
        <a href="tel:02838386852" className="py-2 text-xl hover:text-primary">
          {t("phone")}
        </a>
        <a href="tel:02838386853" className="py-2 text-xl hover:text-primary">
          {t("fax")}
        </a>
        <a
          href="mailto:hotro@futa.vn"
          className="py-2 text-xl hover:text-primary"
        >
          {t("email")}
        </a>
        <a href="tel:19006067" className="py-2 text-xl hover:text-primary">
          {t("hotline")}
        </a>
      </div>
      <div className="col-span-2">
        <div className="flex gap-5 items-center mb-3">
          <Image
            src="/assets/images/contact.svg"
            width={50}
            height={50}
            alt="contact"
          />
          <h2 className="text-primary font-bold text-2xl">
            Gửi thông tin liên hệ đến chúng tôi
          </h2>
        </div>
        <Card className=" bg-[#F2F2F2] p-10 text-4xl">
          <Input placeholder={t("form.fullName")} className="bg-white py-7" />
          <div className="flex gap-5">
            <Input placeholder={t("form.email")} className="bg-white py-7" />
            <Input placeholder={t("form.phone")} className="bg-white py-7" />
          </div>
          <Input placeholder={t("form.title")} className="bg-white py-7" />
          <Textarea placeholder={t("form.notes")} className="bg-white py-7" />
          <Button className="bg-primary text-white py-7">
            {t("form.send")}
          </Button>
        </Card>
      </div>
    </div>
  );
}
