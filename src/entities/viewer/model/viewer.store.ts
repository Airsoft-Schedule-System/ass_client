// Supabase 인증 사용자와 초기 세션 복구 상태를 관리하는 Zustand store

import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

type ViewerStatus = 'initializing' | 'authenticated' | 'unauthenticated';

type ViewerStore = {
  user: User | null; // 현재 Supabase 세션에 로그인된 사용자
  status: ViewerStatus; // 세션 확인 중·로그인·비로그인 상태
  setViewer: (user: User | null) => void; // 확인된 사용자와 인증 상태를 함께 반영하는 함수
};

export const useViewerStore = create<ViewerStore>()((set) => ({
  user: null,
  status: 'initializing',
  setViewer: (user) =>
    set({
      user,
      status: user ? 'authenticated' : 'unauthenticated',
    }),
}));
