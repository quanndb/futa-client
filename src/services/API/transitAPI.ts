import { Page, PagingRequest } from "@/lib/types/Paging";
import axios from "@/services";

export type TransitPoint = {
  id: string;
  name: string;
  address: string;
  hotline: string;
  type: TransitPointType;
};

export enum TransitPointType {
  PLACE,
  STATION,
  OFFICE,
  TRANSPORT,
}

const transitAPI = {
  getTransit: (
    params: PagingRequest
  ): Promise<{ data: TransitPoint[]; page: Page }> => {
    const url = "trip/api/v1/transit-points";
    return axios.get(url, { params });
  },
};

export default transitAPI;
