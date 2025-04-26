"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Calendar,
  ChevronRight,
  Coffee,
  FilterIcon,
  Home,
  MapPin,
  Wifi,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface BusTicket {
  id: string;
  company: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatsAvailable: number;
  duration: string;
  vehicleType: string;
  amenities: string[];
  rating: number;
}

const mockTickets: BusTicket[] = [
  {
    id: "T1001",
    company: "Phương Trang",
    departureTime: "07:00",
    arrivalTime: "13:30",
    price: 250000,
    seatsAvailable: 12,
    duration: "6h 30m",
    vehicleType: "Limousine",
    amenities: ["Wifi", "Air Conditioning", "Snacks"],
    rating: 4.5,
  },
  {
    id: "T1002",
    company: "Thành Bưởi",
    departureTime: "08:30",
    arrivalTime: "15:45",
    price: 200000,
    seatsAvailable: 8,
    duration: "7h 15m",
    vehicleType: "Seat",
    amenities: ["Wifi", "Air Conditioning", "Blanket"],
    rating: 4.2,
  },
  {
    id: "T1003",
    company: "Kumho",
    departureTime: "12:00",
    arrivalTime: "18:15",
    price: 300000,
    seatsAvailable: 4,
    duration: "6h 15m",
    vehicleType: "Bunk",
    amenities: ["Wifi", "Coffee", "Blanket", "Charging Port"],
    rating: 4.7,
  },
  {
    id: "T1004",
    company: "Hoàng Long",
    departureTime: "16:30",
    arrivalTime: "23:00",
    price: 270000,
    seatsAvailable: 15,
    duration: "6h 30m",
    vehicleType: "Limousine",
    amenities: ["Wifi", "Air Conditioning", "Snacks", "Blanket"],
    rating: 4.3,
  },
  {
    id: "T1005",
    company: "Phú Quang",
    departureTime: "20:00",
    arrivalTime: "02:15",
    price: 220000,
    seatsAvailable: 20,
    duration: "6h 15m",
    vehicleType: "Seat",
    amenities: ["Wifi", "Air Conditioning"],
    rating: 4.0,
  },
];
export default function TicketResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState<BusTicket[]>(mockTickets);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    vehicle: "",
    timeRange: "",
    minPrice: 0,
    maxPrice: 1000000,
  });
  const [showFilters, setShowFilters] = useState(false);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const fromId = searchParams.get("fromId") || "";
  const toId = searchParams.get("toId") || "";
  const fromTime = searchParams.get("fromTime") || "";
  const toTime = searchParams.get("toTime") || "";
  const isReturn = searchParams.get("isReturn") === "true";
  const ticketCount = parseInt(searchParams.get("ticketCount") || "1");

  //   setTickets(mockTickets);
  // useEffect(() => {
  //   if (!from || !to || !fromTime) {
  //     router.push('/bookings');
  //     return;
  //   }

  // }, [from, to, fromTime, toTime, isReturn, ticketCount, router]);

  const formatDate = (dateStr: string) => {
    try {
      const [month, day, year] = dateStr.split("-");
      return format(new Date(`${year}-${month}-${day}`), "dd/MM/yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.append("ticketId", ticketId);

    router.push(`/bookings/chi-tiet?${params.toString()}`);
  };

  const filteredTickets = tickets.filter((ticket) => {
    return (
      (filter.vehicle === "" || ticket.vehicleType === filter.vehicle) &&
      ticket.price >= filter.minPrice &&
      ticket.price <= filter.maxPrice
    );
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => a.price - b.price);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const goBackToSearch = () => {
    router.push(
      `/bookings?from=${from}&to=${to}&fromTime=${fromTime}&isReturn=${isReturn}`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="h-4 w-4 mr-1" />
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/bookings">Đặt vé</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Kết quả tìm kiếm</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {from} - {to}
        </h1>
        <div className="flex flex-wrap items-center text-sm text-gray-600">
          <div className="flex items-center mr-6 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Ngày đi: {formatDate(fromTime)}</span>
          </div>
          {isReturn && toTime && (
            <div className="flex items-center mr-6 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Ngày về: {formatDate(toTime)}</span>
            </div>
          )}
          <div className="flex items-center mb-2">
            <Badge variant="outline" className="mr-2">
              {ticketCount} vé
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
          <Card className="sticky top-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Bộ lọc tìm kiếm</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilter({
                      vehicle: "",
                      timeRange: "",
                      minPrice: 0,
                      maxPrice: 1000000,
                    })
                  }
                >
                  Xóa lọc
                </Button>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  Loại xe
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="seat"
                      checked={filter.vehicle === "Seat"}
                      onCheckedChange={() =>
                        setFilter({
                          ...filter,
                          vehicle: filter.vehicle === "Seat" ? "" : "Seat",
                        })
                      }
                      className="text-orange-500"
                    />
                    <Label htmlFor="seat" className="ml-2">
                      Ghế ngồi
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="bunk"
                      checked={filter.vehicle === "Bunk"}
                      onCheckedChange={() =>
                        setFilter({
                          ...filter,
                          vehicle: filter.vehicle === "Bunk" ? "" : "Bunk",
                        })
                      }
                      className="text-orange-500"
                    />
                    <Label htmlFor="bunk" className="ml-2">
                      Giường nằm
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="limousine"
                      checked={filter.vehicle === "Limousine"}
                      onCheckedChange={() =>
                        setFilter({
                          ...filter,
                          vehicle:
                            filter.vehicle === "Limousine" ? "" : "Limousine",
                        })
                      }
                      className="text-orange-500"
                    />
                    <Label htmlFor="limousine" className="ml-2">
                      Limousine
                    </Label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  Giờ khởi hành
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="time-morning" />
                    <Label htmlFor="time-morning" className="ml-2">
                      Sáng (06:00 - 12:00)
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="time-afternoon" />
                    <Label htmlFor="time-afternoon" className="ml-2">
                      Chiều (12:00 - 18:00)
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="time-evening" />
                    <Label htmlFor="time-evening" className="ml-2">
                      Tối (18:00 - 24:00)
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="time-midnight" />
                    <Label htmlFor="time-midnight" className="ml-2">
                      Đêm (00:00 - 06:00)
                    </Label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">
                  Khoảng giá
                </Label>
                <Select defaultValue="">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn khoảng giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-200000">Dưới 200.000đ</SelectItem>
                    <SelectItem value="200000-300000">
                      200.000đ - 300.000đ
                    </SelectItem>
                    <SelectItem value="300000-400000">
                      300.000đ - 400.000đ
                    </SelectItem>
                    <SelectItem value="400000-up">Trên 400.000đ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="lg:hidden mb-4">
            <Button
              onClick={toggleFilters}
              variant="outline"
              className="w-full flex justify-between items-center"
            >
              <span className="flex items-center">
                <FilterIcon className="h-4 w-4 mr-2" />
                Lọc kết quả
              </span>
              <ChevronRight
                className={`h-4 w-4 transform transition-transform ${
                  showFilters ? "rotate-90" : ""
                }`}
              />
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {filteredTickets.length} kết quả tìm thấy
            </p>
            <Select defaultValue="price-asc">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Giá: Thấp - Cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao - Thấp</SelectItem>
                <SelectItem value="time-asc">Giờ đi: Sớm nhất</SelectItem>
                <SelectItem value="time-desc">Giờ đi: Muộn nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="mb-4">
                <img
                  src="/api/placeholder/200/200"
                  alt="No results"
                  className="w-32 h-32"
                />
              </div>
              <h3 className="text-lg font-medium">Không có kết quả nào</h3>
              <p className="text-gray-500 text-center mt-2">
                Không tìm thấy vé nào phù hợp với tìm kiếm của bạn.
                <br />
                Vui lòng thử lại với những tiêu chí khác.
              </p>
            </div>
          ) : ( */}
          <div className="space-y-4">
            {sortedTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-100">
                    <div className="p-4 md:col-span-3">
                      <div className="flex items-center mb-2">
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-600 mr-2"
                        >
                          {ticket.vehicleType}
                        </Badge>
                        <h3 className="font-semibold">{ticket.company}</h3>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div>
                          <p className="text-xl font-bold">
                            {ticket.departureTime}
                          </p>
                          <p className="text-sm text-gray-500">{from}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-xs text-gray-500 mb-1">
                            {ticket.duration}
                          </div>
                          <div className="w-full h-0.5 bg-gray-300 relative">
                            <div className="absolute top-1/2 left-0 w-2 h-2 bg-gray-500 rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-2 h-2 bg-gray-500 rounded-full transform -translate-y-1/2"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {ticket.arrivalTime}
                          </p>
                          <p className="text-sm text-gray-500">{to}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        {ticket.amenities.includes("Wifi") && (
                          <div className="flex items-center">
                            <Wifi className="h-3 w-3 mr-1" />
                            <span>Wifi</span>
                          </div>
                        )}
                        {ticket.amenities.includes("Coffee") && (
                          <div className="flex items-center">
                            <Coffee className="h-3 w-3 mr-1" />
                            <span>Đồ uống</span>
                          </div>
                        )}
                        {ticket.amenities.includes("Air Conditioning") && (
                          <div className="flex items-center">
                            <svg
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M9.5 7.5v9M14.5 7.5v9M3.5 12h17M6.5 7.5C6.5 5.5 8 4 10 4h4c2 0 3.5 1.5 3.5 3.5v9c0 2-1.5 3.5-3.5 3.5h-4c-2 0-3.5-1.5-3.5-3.5v-9z" />
                            </svg>
                            <span>Máy lạnh</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Đón/Trả: Bến xe</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-xl font-bold text-orange-600 mb-1">
                          {ticket.price.toLocaleString("vi-VN")}đ
                        </p>
                        <p className="text-sm text-gray-600">
                          Còn {ticket.seatsAvailable} chỗ
                        </p>
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">
                        Chọn chỗ
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(ticket.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1">{ticket.rating}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <button className="text-blue-600 hover:underline">
                          24 đánh giá
                        </button>
                      </div>
                      <button className="text-blue-600 hover:underline">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
