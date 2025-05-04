import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Honor() {
  const t = useTranslations("home");
  return (
    <div className="px-5">
      <h2 className="text-3xl text-secondary uppercase font-bold text-center">
        {t("honor.title")}
      </h2>
      <p className="text-center py-2 text-xl">{t("trustAndChosen")}</p>

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center my-5">
        <div className="flex flex-col gap-5 justify-between">
          <div className="flex gap-3">
            <Image
              src={"/assets/images/show1.svg"}
              width={70}
              height={70}
              alt={"Honor"}
              className="h-auto w-auto"
            />
            <div>
              <p className="text-4xl font-bold">
                {t("honor.first.num")}
                <span className="text-xl ml-5">{t("honor.first.unit")}</span>
              </p>
              <p>{t("honor.first.des")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Image
              src={"/assets/images/show2.svg"}
              width={70}
              height={70}
              alt={"Honor"}
              className="h-auto w-auto"
            />
            <div>
              <p className="text-4xl font-bold">
                {t("honor.second.num")}
                <span className="text-xl ml-5">{t("honor.second.unit")}</span>
              </p>
              <p>{t("honor.second.des")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Image
              src={"/assets/images/show3.svg"}
              width={70}
              height={70}
              alt={"Honor"}
              className="h-auto w-auto"
            />
            <div>
              <p className="text-4xl font-bold">
                {t("honor.third.num")}
                <span className="text-xl ml-5">{t("honor.third.unit")}</span>
              </p>
              <p>{t("honor.third.des")}</p>
            </div>
          </div>
        </div>
        <Image
          src={"/assets/images/honor.svg"}
          width={600}
          height={600}
          alt={"Honor"}
          className="h-auto w-auto"
        />
      </div>
    </div>
  );
}
