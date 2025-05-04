import { UserInfo } from "@/lib/types/UserInfo";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserInfoState = {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
};

export const useUserInfo = create<UserInfoState>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (userInfo) => set({ userInfo }),
    }),
    { name: "userInfo" }
  )
);
