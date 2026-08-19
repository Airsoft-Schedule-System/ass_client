// 게임 목록과 현재 사용자의 참가 상태를 함께 조회하고 화면 상태로 제공

import { useEffect, useState } from 'react';
import {
  listParticipationsForUser,
  listUpcomingSessions,
  ParticipationAppError,
  toSessionError,
} from '@/shared/api';
import type { ParticipationSummary, SessionSummary } from '@/shared/api';

export type GameListData = {
  participations: ParticipationSummary[]; // 현재 사용자의 참가 상태 목록
  sessions: SessionSummary[]; // 홈에 표시할 다가오는 게임 목록
};

function getGameListErrorMessage(error: unknown) {
  if (error instanceof ParticipationAppError) return error.message;
  return toSessionError(error).message;
}

export function useGameList(userId: string | undefined) {
  const [data, setData] = useState<GameListData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    const currentUserId = userId;

    async function loadGameList() {
      setData(null);
      setErrorMessage(null);

      try {
        const [sessions, participations] = await Promise.all([
          listUpcomingSessions(),
          listParticipationsForUser(currentUserId),
        ]);

        if (!cancelled) setData({ participations, sessions });
      } catch (error) {
        if (!cancelled) setErrorMessage(getGameListErrorMessage(error));
      }
    }

    void loadGameList();

    return () => {
      cancelled = true;
    };
  }, [requestVersion, userId]);

  return {
    data,
    errorMessage,
    retry: () => setRequestVersion((version) => version + 1),
  };
}
