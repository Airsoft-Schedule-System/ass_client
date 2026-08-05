// Supabase 인증 사용자와 초기 세션 복구 상태를 관리하는 Zustand store

import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { getSession, onAuthStateChange } from '@/api/auth/auth';

type AuthStore = {
  user: User | null; // 현재 Supabase 세션에 로그인된 사용자
  isLoading: boolean; // 저장된 세션을 처음 확인하고 있는지 여부
};

export const useAuthStore = create<AuthStore>()(() => ({
  user: null,
  isLoading: true,
}));

// 저장된 세션을 복구하고 이후 인증 변경을 store에 동기화
export function startAuthSessionSync() {
  let isActive = true;

  async function restoreSession() {
    try {
      const session = await getSession();

      if (isActive) {
        useAuthStore.setState({
          user: session?.user ?? null,
          isLoading: false,
        });
      }
    } catch (error) {
      if (isActive) useAuthStore.setState({ user: null, isLoading: false });
      console.error('Supabase 세션을 복구하지 못했습니다.', error);
    }
  }

  void restoreSession();

  const subscription = onAuthStateChange((_event, session) => {
    if (!isActive) return;

    useAuthStore.setState({
      user: session?.user ?? null,
      isLoading: false,
    });
  });

  return () => {
    isActive = false;
    subscription.unsubscribe();
  };
}
