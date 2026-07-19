// URL 경로와 React 화면 컴포넌트의 연결 관계를 정의

import { createBrowserRouter } from 'react-router';
import App from '@/App';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
]);
