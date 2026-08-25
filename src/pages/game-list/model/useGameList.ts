// 다가오는 게임 목록을 조회하고 화면 상태로 제공

import { useEffect, useState } from 'react';
import { listUpcomingSessions, toSessionError } from '@/shared/api';
import type { SessionSummary } from '@/shared/api';

export type GameListData = {
  sessions: SessionSummary[]; // 홈에 표시할 다가오는 게임 목록
};

function getGameListErrorMessage(error: unknown) {
  return toSessionError(error).message;
}

export function useGameList(userId: string | undefined) {
  const [data, setData] = useState<GameListData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    async function loadGameList() {
      setData(null);
      setErrorMessage(null);

      try {
        const sessions = await listUpcomingSessions();

        if (!cancelled) setData({ sessions });
      } catch (error) {
        if (!cancelled) setErrorMessage(getGameListErrorMessage(error));
      }
    }

    void loadGameList();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return {
    data,
    errorMessage,
  };
}
