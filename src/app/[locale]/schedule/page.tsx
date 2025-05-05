"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CustomPagination } from "@/components/ui/customPagination";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { intToHour, intToMin } from "@/lib/utils/TimeConverter";
import routeAPI, { Route } from "@/services/API/routeAPI";
import { useRecentSearches } from "@/store/RecentSearches";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TransportationSearch() {
  const t = useTranslations();
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [page, setPage] = useState(1);
  const { addRecentSearch } = useRecentSearches();

  const { data } = useQuery({
    queryKey: ["routes", origin, destination, page],
    queryFn: () =>
      routeAPI.getRoutes({
        departureKeyword: origin,
        destinationKeyword: destination,
        pageIndex: page,
        sortBy: "name.asc",
      }),
  });

  const routeData = data?.data || [];
  const totalPages = data?.page
    ? Math.ceil(data.page.total / data.page.pageSize)
    : 1;

  const groupedRoutes: { [key: string]: Route[] } = {};
  if (routeData) {
    routeData.forEach((route) => {
      if (!groupedRoutes[route.departure]) {
        groupedRoutes[route.departure] = [];
      }
      groupedRoutes[route.departure].push(route);
    });
  }

  const handleSearchTrip = (route: Route) => {
    if (!route) return;
    addRecentSearch({
      origin: { value: route.departureId, label: route.departure },
      destination: { value: route.destinationId, label: route.destination },
    });
    router.push("/bookings");
  };

  return (
    <div className="container mx-auto max-w-6xl my-10 justify-self-start">
      <div className="rounded-lg">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("schedulePage.enterDeparture")}
              className="pl-10"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full"></div>
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("schedulePage.enterDestination")}
              className="pl-10"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <Tabs defaultValue="route" className="w-full">
          <TabsList className="w-full grid grid-cols-8 mb-4 ">
            <TabsTrigger value="route" className="col-span-4">
              {t("schedulePage.route")}
            </TabsTrigger>
            <TabsTrigger className="col-span-2" value="distance" disabled>
              {t("schedulePage.distance")}
            </TabsTrigger>
            <TabsTrigger value="time" disabled>
              {t("schedulePage.duration")}
            </TabsTrigger>
            <TabsTrigger value="" disabled></TabsTrigger>
          </TabsList>

          <TabsContent value="route" className="mt-0">
            <div className="space-y-4">
              {Object.keys(groupedRoutes).length > 0 ? (
                Object.entries(groupedRoutes).map(([origin, routes]) => (
                  <Card key={origin} className="border rounded-lg py-0">
                    <div className="">
                      <div className="divide-y">
                        {routes.map((route) => (
                          <div
                            key={route.id}
                            className="grid grid-cols-4 p-4 gap-4"
                          >
                            <div className="flex items-center gap-2 col-span-2">
                              <span className="text-orange-500">
                                {route.departure}
                              </span>
                              {" -> "}
                              <span>{route.destination}</span>
                            </div>
                            <div className="flex items-center">
                              {route.distance} Km
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{`${intToHour(route.duration)} ${t(
                                "common.hour"
                              )} ${intToMin(route.duration)} ${t(
                                "common.min"
                              )}`}</span>
                              <Button
                                variant="outline"
                                className="bg-orange-100 text-orange-500 hover:bg-orange-200 hover:text-orange-600 border-orange-200"
                                onClick={() => handleSearchTrip(route)}
                              >
                                {t("common.searchTrip")}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="my-40">
                  <Image
                    src={"/assets/images/nodata.png"}
                    width={200}
                    height={200}
                    alt="No data"
                    className="mx-auto"
                  />
                  <p className="text-center mt-5 font-bold text-primary opacity-60 text-2xl">
                    {t("common.nodata")}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
