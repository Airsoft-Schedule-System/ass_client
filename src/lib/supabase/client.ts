// 로그인과 세션 관리에서 함께 사용하는 Supabase 싱글턴 클라이언트

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 로컬과 CI/CD의 Supabase 환경변수 누락을 앱 시작 전에 차단
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    // 브라우저 저장소의 세션을 복구하고 만료 전 토큰을 자동 갱신
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});
