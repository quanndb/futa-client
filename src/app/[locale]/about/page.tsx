import { useTranslations } from "next-intl";
import Image from "next/image";

const services = ["s1", "s2", "s3", "s4", "s5"];

export default function About() {
  const t = useTranslations("about");

  return (
    <div className="layout my-20">
      <h1 className="text-4xl text-primary text-center font-bold mb-5">
        {t("name")}
      </h1>
      <h2 className="text-2xl text-secondary text-center font-bold mb-5">
        {t("sub")}
      </h2>
      <p className="text-justify">{t("des1")}</p>
      <br />
      <p className="text-justify">{t("des2")}</p>
      <br />
      {services.map((item, idx) => (
        <div
          key={item}
          className={`flex mb-12 ${idx % 2 !== 0 ? "flex-row-reverse" : ""}`}
        >
          <div className="w-1/2 p-4 flex justify-center">
            <Image
              src={`/assets/images/${item}.png`}
              alt={t(`services.${item}.name`)}
              width={500}
              height={250}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="w-1/2 p-4">
            <h3 className="text-4xl font-bold text-primary mb-2">
              {t(`services.${item}.name`)}
            </h3>
            <p>{t(`services.${item}.des`)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
