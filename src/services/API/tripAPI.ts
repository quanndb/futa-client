import { Page } from "@/lib/types/Paging";
import axios from "@/services";
import { TransitPoint } from "@/services/API/transitAPI";

export type TripFilterRequest = {
  departureId: string;
  destinationId: string;
  departureDate: string;
  "departureTime.fromTime": string;
  "departureTime.toTime": string;
  busType?: BusType[];
  orderBy?: TripOrderBy[];
};

export enum BusType {
  SEAT = "SEAT",
  BED = "BED",
  LIMOUSINE = "LIMOUSINE",
}

export type TypeDetails = {
  id: string;
  type: BusType;
  seatCapacity: number;
  firstFloorSeats: Seat[];
  secondFloorSeats?: Seat[];
};

export type Seat = {
  id: string;
  seatNumber: string;
};

export enum TripOrderBy {
  PRICE = "PRICE",
  DEPARTURE_TIME = "DEPARTURE_TIME",
}

export type TripResponse = {
  id: string;
  departureDate: string;
  details: TripDetails;
  tripTransits: TripTransit[];
};

export type TripDetails = {
  id: string;
  fromDate: string;
  toDate: string;
  price: number;
  type: BusType;
  typeDetails: TypeDetails;
  status: TripStatus;
};

export enum TripStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type TripTransit = {
  id: string;
  transitPoint?: TransitPoint;
  arrivalTime?: string;
  transitOrder?: number;
  type?: TransitType;
};

export enum TransitType {
  PICKUP = "PICKUP",
  DROP = "DROP",
  BOTH = "BOTH",
}

const tripAPI = {
  getTrips: (
    params: TripFilterRequest
  ): Promise<{ data: TripResponse[]; page: Page }> => {
    const url = "/trip/api/v1/trips/schedules";
    return axios.get(url, { params });
  },
};

export default tripAPI;
