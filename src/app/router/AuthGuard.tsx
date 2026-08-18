// 인증 상태에 따라 현재 하위 경로의 접근 여부를 결정

import { Navigate, Outlet } from 'react-router';
import { useViewerStore } from '@/entities/viewer';

type AuthGuardProps = {
  access: 'authenticated' | 'guest'; // 하위 경로에 접근할 수 있는 인증 상태
};

export function AuthGuard({ access }: AuthGuardProps) {
  const status = useViewerStore((state) => state.status);

  // 저장된 세션을 확인하는 동안 잘못된 화면이 나타나지 않게 대기
  if (status === 'initializing') return null;

  if (access === 'authenticated' && status === 'unauthenticated') {
    return <Navigate replace to="/login" />;
  }

  if (access === 'guest' && status === 'authenticated') {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}
