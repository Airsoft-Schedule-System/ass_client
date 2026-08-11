// URL 경로와 React 화면 컴포넌트의 연결 관계를 정의

import { createBrowserRouter } from 'react-router';
import App from '@/App';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { MainPage } from '@/features/main/pages/MainPage';
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
            Component: MainPage,
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
