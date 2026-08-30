// URL 경로와 React 화면 컴포넌트의 연결 관계를 정의

import { createBrowserRouter } from 'react-router';
import { GameCreatePage } from '@/pages/game-create';
import { GameDetailPage } from '@/pages/game-detail';
import { GameListPage } from '@/pages/game-list';
import { LoginPage } from '@/pages/login';
import { OperationListPage } from '@/pages/operation-list';
import { OperationOverviewPage } from '@/pages/operation-overview';
import { ParticipationDetailPage } from '@/pages/participation-detail';
import { ParticipationListPage } from '@/pages/participation-list';
import { ProfilePage } from '@/pages/profile';
import { ProfileEditPage } from '@/pages/profile-edit';
import { SignUpPage } from '@/pages/sign-up';
import { AuthGuard } from './AuthGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        element: <AuthGuard access="authenticated" />,
        children: [
          {
            index: true,
            Component: GameListPage,
          },
          {
            path: 'participations',
            Component: ParticipationListPage,
          },
          {
            path: 'participations/:participationId',
            Component: ParticipationDetailPage,
          },
          {
            path: 'games/new',
            Component: GameCreatePage,
          },
          {
            path: 'games/:sessionId',
            Component: GameDetailPage,
          },
          {
            path: 'operations',
            Component: OperationListPage,
          },
          {
            path: 'operations/:sessionId',
            Component: OperationOverviewPage,
          },
          {
            path: 'profile',
            Component: ProfilePage,
          },
          {
            path: 'profile/setup',
            Component: ProfileEditPage,
          },
        ],
      },
      {
        element: <AuthGuard access="guest" />,
        children: [
          {
            path: 'login',
            Component: LoginPage,
          },
        ],
      },
      {
        path: 'signup',
        Component: SignUpPage,
      },
    ],
  },
]);
