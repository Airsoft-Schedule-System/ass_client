// 게임 세션 상태를 사용자용 문구와 색상으로 표시

import type { GameSessionStatus } from '@/shared/api';
import { StatusBadge } from '@/shared/ui';
import type { StatusBadgeTone } from '@/shared/ui';

type GameSessionStatusBadgeProps = {
  status: GameSessionStatus; // 표시할 게임 세션 상태
};

const statusLabels: Record<GameSessionStatus, string> = {
  recruiting: '모집 중',
  closed: '모집 마감',
  inProgress: '진행 중',
  completed: '진행 완료',
  cancelled: '취소',
};

const statusTones: Record<GameSessionStatus, StatusBadgeTone> = {
  recruiting: 'brand',
  closed: 'neutral',
  inProgress: 'neutral',
  completed: 'neutral',
  cancelled: 'neutral',
};

export function GameSessionStatusBadge({ status }: GameSessionStatusBadgeProps) {
  return <StatusBadge tone={statusTones[status]}>{statusLabels[status]}</StatusBadge>;
}
