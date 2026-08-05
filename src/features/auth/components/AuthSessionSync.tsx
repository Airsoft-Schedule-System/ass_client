// 앱 생명주기에 맞춰 Supabase 세션 복구와 인증 변경 구독을 관리

import { useEffect } from 'react';
import { startAuthSessionSync } from '@/features/auth/stores/auth.store';

export function AuthSessionSync() {
  useEffect(() => startAuthSessionSync(), []);

  return null;
}
