// 최상위 인증 화면 사이를 이동하고 현재 위치를 표시하는 공통 하단 내비게이션

import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { CalendarIcon, OperationsIcon, PlusIcon, TicketIcon, UserIcon } from '@/shared/ui';

type NavigationItem = {
  emphasizeIcon?: boolean; // 비활성 상태에서도 생성 아이콘을 브랜드 색상으로 강조할지 여부
  end?: boolean; // 하위 경로까지 활성 상태에 포함할지 여부
  icon: ReactNode; // 메뉴의 기능을 나타내는 아이콘
  label: string; // 사용자에게 표시할 메뉴 이름
  narrow?: boolean; // Pen 디자인에서 생성 메뉴의 좁은 너비를 적용할지 여부
  to: string; // 메뉴를 선택했을 때 이동할 경로
};

const navigationItems: NavigationItem[] = [
  { end: true, icon: <CalendarIcon />, label: '게임', to: '/' },
  { icon: <TicketIcon />, label: '내 참가', to: '/participations' },
  {
    emphasizeIcon: true,
    icon: <PlusIcon />,
    label: '만들기',
    narrow: true,
    to: '/games/new',
  },
  { icon: <OperationsIcon />, label: '운영', to: '/operations' },
  { icon: <UserIcon />, label: '내 정보', to: '/profile' },
];

export function BottomNavigation() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="flex h-17 w-full items-center justify-between rounded-full border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-2.5 py-1.5"
    >
      {navigationItems.map(({ emphasizeIcon, end, icon, label, narrow, to }) => (
        <NavLink
          className={({ isActive }) =>
            `flex h-14 ${narrow ? 'w-14' : 'w-15'} shrink-0 flex-col items-center justify-center gap-1 rounded-3xl text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)] ${
              isActive
                ? 'bg-[var(--color-app-surface-secondary)]'
                : 'hover:bg-[var(--color-app-surface-secondary)]'
            }`
          }
          end={end}
          key={to}
          to={to}
        >
          {({ isActive }) => (
            <>
              <span
                aria-hidden="true"
                className={`flex items-center justify-center [&>svg]:size-full ${narrow ? 'size-[22px]' : 'size-[18px]'} ${isActive || emphasizeIcon ? 'text-[var(--color-app-brand)]' : 'text-[var(--color-app-muted)]'}`}
              >
                {icon}
              </span>
              <span
                className={`truncate ${isActive ? 'font-bold text-[var(--color-app-brand)]' : 'font-medium text-[var(--color-app-muted)]'}`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
