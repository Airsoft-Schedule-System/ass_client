// 앱 생명주기에 맞춰 Supabase 세션 복구와 viewer 상태 동기화를 관리

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useViewerStore } from '@/entities/viewer';
import { onAuthStateChange } from '@/shared/api';

type ViewerSessionProviderProps = {
  children: ReactNode; // 인증 세션이 적용될 애플리케이션 트리
};

export function ViewerSessionProvider({ children }: ViewerSessionProviderProps) {
  useEffect(() => {
    const subscription = onAuthStateChange((_event, session) => {
      useViewerStore.getState().setViewer(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return children;
}
