// 여러 페이지의 제목과 설명을 동일한 형태로 표시

type HeaderProps = {
  title: string; // 페이지의 주요 제목
  description: string; // 제목 아래에 표시할 보조 설명
};

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex flex-col gap-1 pt-4">
      <h1 className="text-3xl font-bold text-[var(--color-app-foreground)]">{title}</h1>
      <p className="text-sm font-semibold text-[var(--color-app-brand)]">{description}</p>
    </header>
  );
}
