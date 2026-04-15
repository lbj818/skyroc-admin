import type { UserInfo } from 'common-app/api/login'
import { getUserInfoApi } from 'common-app/api/login'
import { create } from 'zustand'

interface UserState {
  setUserInfo: () => void;
  userInfo: UserInfo | null
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: async () => {
    const res = await getUserInfoApi()
    set({ userInfo: res.data })
  }
}))
