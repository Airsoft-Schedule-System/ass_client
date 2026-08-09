// Supabase 인증 사용자와 초기 세션 복구 상태를 관리하는 Zustand store

import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';

type AuthStore = {
  user: User | null; // 현재 Supabase 세션에 로그인된 사용자
  status: AuthStatus; // 세션 확인 중·로그인·비로그인 상태
  setAuthUser: (user: User | null) => void; // 확인된 사용자와 인증 상태를 함께 반영하는 함수
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  status: 'initializing',
  setAuthUser: (user) =>
    set({
      user,
      status: user ? 'authenticated' : 'unauthenticated',
    }),
}));
