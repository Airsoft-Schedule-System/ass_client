// 게임 상세와 현재 사용자의 참가 상태를 함께 조회하고 화면 상태로 제공

import { useEffect, useState } from 'react';
import {
  findParticipationForUserAndSession,
  findSessionById,
  ParticipationAppError,
  toSessionError,
} from '@/shared/api';
import type { ParticipationSummary, SessionDetail } from '@/shared/api';

export type GameDetailData = {
  participation: ParticipationSummary | null; // 현재 사용자의 이 게임 참가 상태
  session: SessionDetail; // 상세 화면에 표시할 게임 세션
};

function getGameDetailErrorMessage(error: unknown) {
  if (error instanceof ParticipationAppError) return error.message;
  return toSessionError(error).message;
}

export function useGameDetail(sessionId: string | undefined, userId: string | undefined) {
  const [data, setData] = useState<GameDetailData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!sessionId || !userId) return;

    let cancelled = false;
    const currentSessionId = sessionId;
    const currentUserId = userId;

    async function loadGameDetail() {
      setData(null);
      setErrorMessage(null);
      setNotFound(false);

      try {
        const [session, participation] = await Promise.all([
          findSessionById(currentSessionId),
          findParticipationForUserAndSession(currentUserId, currentSessionId),
        ]);

        if (cancelled) return;

        if (!session) {
          setNotFound(true);
          return;
        }

        setData({ participation, session });
      } catch (error) {
        if (!cancelled) setErrorMessage(getGameDetailErrorMessage(error));
      }
    }

    void loadGameDetail();

    return () => {
      cancelled = true;
    };
  }, [requestVersion, sessionId, userId]);

  return {
    data,
    errorMessage,
    notFound,
    retry: () => setRequestVersion((version) => version + 1),
  };
}
