// 전체 화면 크기를 고정하고 현재 경로의 페이지를 표시하는 앱 최상위 레이아웃

import { Outlet } from 'react-router';

function App() {
  return (
    <main className="h-dvh w-full overflow-hidden bg-[var(--color-app-background)]">
      <Outlet />
    </main>
  );
}

export default App;
