// 인증 상태를 동기화하고 현재 경로의 페이지를 표시하는 앱 진입점

import { Outlet } from 'react-router';
import { useViewerSessionSync } from '@/entities/viewer';

export function RootLayout() {
  useViewerSessionSync();

  return <Outlet />;
}
