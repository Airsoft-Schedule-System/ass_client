// URL 경로와 React 화면 컴포넌트의 연결 관계를 정의

import { Navigate, createBrowserRouter } from 'react-router';
import App from '@/App';
import { LoginPage } from '@/features/auth/pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        element: <Navigate replace to="/login" />,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
    ],
  },
]);
