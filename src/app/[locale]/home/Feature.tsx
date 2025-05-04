import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";
import Image from "next/image";

const data = [
  {
    id: 1,
    imageUrl: "/assets/images/feature1.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
  {
    id: 2,
    imageUrl: "/assets/images/feature2.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
  {
    id: 3,
    imageUrl: "/assets/images/feature3.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
  {
    id: 4,
    imageUrl: "/assets/images/feature1.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
  {
    id: 5,
    imageUrl: "/assets/images/feature2.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
  {
    id: 6,
    imageUrl: "/assets/images/feature3.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
  {
    id: 7,
    imageUrl: "/assets/images/feature1.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
  {
    id: 8,
    imageUrl: "/assets/images/feature2.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
  {
    id: 9,
    imageUrl: "/assets/images/feature3.png",
    url: "https://beta.futabus.vn/tin-tuc/futa-dong-hanh-cung-shb-nhan-doi-qua-tang",
  },
];

export default function Feature() {
  const t = useTranslations("home");

  return (
    <div className="my-20 px-5">
      <h2 className="text-3xl text-secondary uppercase font-bold text-center">
        {t("feature")}
      </h2>
      <Carousel>
        <CarouselContent className="pl-1 md:basis-1/2 lg:basis-1/3 my-3">
          {data.map((item) => (
            <CarouselItem key={item.id} className="lg:basis-1/3">
              <div key={item.id} className="h-full">
                <a href={item.url} className="h-full">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    width={343}
                    height={180}
                    className="w-full h-full rounded-2xl"
                  />
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="text-primary font-bold" />
        <CarouselPrevious className="text-primary font-bold" />
      </Carousel>
    </div>
  );
}
