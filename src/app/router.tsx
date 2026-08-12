// URL 경로와 React 화면 컴포넌트의 연결 관계를 정의

import { createBrowserRouter } from 'react-router';
import App from '@/App';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { GameCreatePage } from '@/features/games/pages/GameCreatePage';
import { GamesPage } from '@/features/games/pages/GamesPage';
import { OperationsPage } from '@/features/operations/pages/OperationsPage';
import { ParticipationsPage } from '@/features/participations/pages/ParticipationsPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { ProfileSetupPage } from '@/features/profile/pages/ProfileSetupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        element: <AuthGuard access="authenticated" />,
        children: [
          {
            index: true,
            Component: GamesPage,
          },
          {
            path: 'participations',
            Component: ParticipationsPage,
          },
          {
            path: 'games/new',
            Component: GameCreatePage,
          },
          {
            path: 'operations',
            Component: OperationsPage,
          },
          {
            path: 'profile',
            Component: ProfilePage,
          },
          {
            path: 'profile/setup',
            Component: ProfileSetupPage,
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
