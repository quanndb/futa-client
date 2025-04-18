"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface RouteData {
  id: number;
  origin: string;
  destination: string;
  distance: string;
  time: string;
}

export default function TransportationSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const routeData: RouteData[] = [
    {
      id: 1,
      origin: "An Khê (Gia Lai)",
      destination: "TP.Hồ Chí Minh",
      distance: "640km",
      time: "13 hours",
    },
    {
      id: 2,
      origin: "An Khê (Gia Lai)",
      destination: "TP.Hồ Chí Minh",
      distance: "690km",
      time: "14 hours",
    },
    {
      id: 3,
      origin: "An Minh (Kiên Giang)",
      destination: "TP.Hồ Chí Minh",
      distance: "295km",
      time: "7 hours",
    },
    {
      id: 4,
      origin: "An Nhơn",
      destination: "TP. Hồ Chí Minh",
      distance: "639km",
      time: "11 hours 30 minutes",
    },
    {
      id: 5,
      origin: "An Nhơn",
      destination: "TP. Hồ Chí Minh",
      distance: "660km",
      time: "13 hours 46 minutes",
    },
    {
      id: 6,
      origin: "An Nhơn",
      destination: "TP.Hồ Chí Minh",
      distance: "627km",
      time: "10 hours 7 minutes",
    },
    {
      id: 7,
      origin: "Bạc Liêu",
      destination: "TP.Hồ Chí Minh",
      distance: "271km",
      time: "6 hours",
    },
    {
      id: 8,
      origin: "Bạc Liêu",
      destination: "TP.Hồ Chí Minh",
      distance: "243km",
      time: "5 hours",
    },
    {
      id: 9,
      origin: "Bảo Lộc",
      destination: "Bình Sơn",
      distance: "650km",
      time: "15 hours 30 minutes",
    },
    {
      id: 10,
      origin: "Bảo Lộc",
      destination: "Đà Nẵng",
      distance: "756km",
      time: "16 hours 38 minutes",
    },
    {
      id: 11,
      origin: "Bảo Lộc",
      destination: "Huế",
      distance: "827km",
      time: "19 hours",
    },
    {
      id: 12,
      origin: "Bảo Lộc",
      destination: "Huế",
      distance: "900km",
      time: "18 hours 30 minutes",
    },
    {
      id: 13,
      origin: "Bến Tre",
      destination: "TP.Hồ Chí Minh",
      distance: "75km",
      time: "2 hours",
    },
  ];

  const groupedRoutes: { [key: string]: RouteData[] } = {};
  routeData.forEach((route) => {
    if (!groupedRoutes[route.origin]) {
      groupedRoutes[route.origin] = [];
    }
    groupedRoutes[route.origin].push(route);
  });

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="rounded-lg">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter origin"
              className="pl-10"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full"></div>
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter destination"
              className="pl-10"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="route" className="w-full">
          <TabsList className="w-full grid grid-cols-8 mb-4 ">
            <TabsTrigger value="route" className="col-span-4">
              Route
            </TabsTrigger>
            <TabsTrigger className="col-span-2" value="distance">
              Distance
            </TabsTrigger>
            <TabsTrigger value="time">Time</TabsTrigger>
            <TabsTrigger value=""></TabsTrigger>
          </TabsList>

          <TabsContent value="route" className="mt-0">
            <div className="space-y-4">
              {Object.entries(groupedRoutes).map(([origin, routes]) => (
                <Card
                  key={origin}
                  className="border rounded-lg py-0"
                >
                  <div className="">
                    <div className="divide-y">
                      {routes.map((route) => (
                        <div
                          key={route.id}
                          className="grid grid-cols-4 p-4 gap-4"
                        >
                          <div className="flex items-center gap-2 col-span-2">
                            <span className="text-orange-500">
                              {route.origin}
                            </span>
                            =<span>{route.destination}</span>
                          </div>
                          <div className="flex items-center">
                            {route.distance}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{route.time}</span>
                            <Button
                              variant="outline"
                              className="bg-orange-100 text-orange-500 hover:bg-orange-200 hover:text-orange-600 border-orange-200"
                            >
                              Search trip
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="distance">
            <div className="p-4 text-center text-gray-500">
              Distance filter view would appear here
            </div>
          </TabsContent>
          <TabsContent value="time">
            <div className="p-4 text-center text-gray-500">
              Time filter view would appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
