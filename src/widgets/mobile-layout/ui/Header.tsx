// 여러 페이지의 뒤로가기와 제목·설명을 동일한 형태로 표시

import { useNavigate } from 'react-router';
import { ArrowLeftIcon } from '@/shared/ui';

type HeaderProps = {
  title: string; // 페이지의 주요 제목
  description?: string; // 제목 아래에 표시할 선택 보조 설명
  showBackButton?: boolean; // 제목 앞의 뒤로가기 버튼 표시 여부
};

export function Header({ title, description, showBackButton = false }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex w-full flex-col gap-1">
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button
            aria-label="뒤로가기"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--color-app-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)] enabled:cursor-pointer"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeftIcon />
          </button>
        ) : null}
        <h1 className="text-3xl font-bold text-[var(--color-app-foreground)]">{title}</h1>
      </div>
      {description ? (
        <p className="text-sm font-semibold text-[var(--color-app-brand)]">{description}</p>
      ) : null}
    </header>
  );
}
