import axios from "@/services";
import { Page, PagingRequest } from "./../../lib/types/Paging";

export type MyWalletResponse = {
  userId: string;
  currentBalance: number;
};

export enum WalletAction {
  DEPOSIT = "DEPOSIT",
  WITH_DRAW = "WITH_DRAW",
  USING = "USING",
  RETURN = "RETURN",
}

export type WalletHistory = {
  id: string;
  currenBalance: number;
  bankCode?: string;
  accountNumber?: string;
  receiverName?: string;
  amount: number;
  content?: string;
  action: WalletAction;
  createdAt: string;
};

export enum WalletCommandStatus {
  WAIT_TO_RESOLVE = "WAIT_TO_RESOLVE",
  WAIT_TO_PAY = "WAIT_TO_PAY",
  REJECTED = "REJECTED",
  SUCCESS = "SUCCESS",
  RETURNED = "RETURNED",
}

export type WalletCommand = {
  id: string;
  code: string;
  bankCode?: string;
  accountNumber?: string;
  receiverName?: string;
  amount: number;
  status: WalletCommandStatus;
  action: WalletAction;
  createdAt: string;
  handlerId?: string;
  handledAt?: string;
  completedAt?: string;
  paymentLink?: string;
};

export interface WalletHistoryPagingRequest extends PagingRequest {
  actions?: WalletAction[];
  transactionDate?: string;
}

export interface WalletCommandPagingRequest extends PagingRequest {
  actions?: WalletAction[];
  statuses?: WalletCommandStatus[];
  transactionDate?: string;
}

const walletAPI = {
  getMyWallet: (): Promise<{ data: MyWalletResponse }> => {
    const url = "/payment/api/v1/me/wallet";
    return axios.get(url);
  },

  getMyWalletHistory: (
    params: WalletHistoryPagingRequest
  ): Promise<{ data: WalletHistory[]; page: Page }> => {
    const url = "/payment/api/v1/me/wallet-histories";
    return axios.get(url, { params });
  },

  getMyWalletCommands: (
    params: WalletCommandPagingRequest
  ): Promise<{ data: WalletCommand[]; page: Page }> => {
    const url = "/payment/api/v1/me/wallet-commands";
    return axios.get(url, { params });
  },
};

export default walletAPI;
