// React 앱과 브라우저 라우터를 DOM 루트에 연결

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import './index.css';
import { router } from '@/app/router';
import { AuthSessionSync } from '@/features/auth/components/AuthSessionSync';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthSessionSync />
    <RouterProvider router={router} />
  </StrictMode>,
);
