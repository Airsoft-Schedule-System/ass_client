// 앱 생명주기에 맞춰 Supabase 세션 복구와 인증 변경 구독을 관리

import { useEffect } from 'react';
import { onAuthStateChange } from '@/shared/api';
import { useViewerStore } from './viewer.store';

export function useViewerSessionSync() {
  useEffect(() => {
    const subscription = onAuthStateChange((_event, session) => {
      useViewerStore.getState().setViewer(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
}
