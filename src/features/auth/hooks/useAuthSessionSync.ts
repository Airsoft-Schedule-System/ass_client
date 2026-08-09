// 앱 생명주기에 맞춰 Supabase 세션 복구와 인증 변경 구독을 관리

import { useEffect } from 'react';
import { onAuthStateChange } from '@/api/auth/auth';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export function useAuthSessionSync() {
  useEffect(() => {
    const subscription = onAuthStateChange((_event, session) => {
      useAuthStore.getState().setAuthUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
}
