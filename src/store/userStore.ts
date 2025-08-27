import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types/user.type';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

/**
 * 로그인 상태 관리 (UserStore)
 *
 * - user: 로그인한 유저 정보 (id, nickname, profileImageUrl)
 * - setUser(user): 유저 정보 업데이트
 * - clearUser(): 로그아웃 시 상태 초기화 및 persist 제거
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              nickname: state.user.nickname,
              profileImageUrl: state.user.profileImageUrl,
            }
          : null,
      }),
    },
  ),
);
