// 전체 화면 크기와 모바일 콘텐츠 너비를 관리하는 앱 최상위 레이아웃

import { MobileLayout } from '@/app/layouts/MobileLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

function App() {
  return (
    <main className="h-dvh w-full overflow-hidden bg-[var(--color-app-background)]">
      <MobileLayout>
        <Input label="이메일" placeholder="email@example.com" />
        <Input label="비밀번호" placeholder="비밀번호 입력" type="password" />
        <Button>로그인</Button>
      </MobileLayout>
    </main>
  );
}

export default App;
