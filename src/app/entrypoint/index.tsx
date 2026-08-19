// React 앱과 브라우저 라우터를 DOM 루트에 연결

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from '../router';
import { ViewerSessionProvider } from '../viewer-session';
import '../styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ViewerSessionProvider>
      <RouterProvider router={router} />
    </ViewerSessionProvider>
  </StrictMode>,
);
