// Supabase Auth의 회원가입·로그인·로그아웃·세션 작업을 앱용 함수로 제공

import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '../../supabase/client';
import { toAuthError } from './auth.error';

export type SignUpInput = {
  email: string;
  password: string;
  displayName: string;
};

// 회원가입과 함께 프로필 생성 트리거에 닉네임 전달
export async function signUp({ email, password, displayName }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) throw toAuthError(error);
  return data;
}

// 이메일과 비밀번호로 세션 생성
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw toAuthError(error);
  return data;
}

// 현재 브라우저의 Supabase 세션 종료
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw toAuthError(error);
}

// Supabase 서버 검증을 거친 현재 사용자 조회
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw toAuthError(error);
  return data.user;
}

// 로그인·로그아웃·토큰 갱신 이벤트 구독
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}
