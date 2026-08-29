// 참가 ID로 현재 사용자의 참가 상세 조회 상태와 새로고침을 관리

import { useEffect, useState } from 'react';
import { findParticipationForUserById, toParticipationError } from '@/shared/api';
import type { UserParticipation } from '@/shared/api';

export function useParticipationDetail(
  participationId: string | undefined,
  userId: string | undefined,
) {
  const [data, setData] = useState<UserParticipation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!participationId || !userId) return;

    let cancelled = false;
    const currentParticipationId = participationId;
    const currentUserId = userId;

    async function loadParticipation() {
      setData(null);
      setErrorMessage(null);
      setNotFound(false);

      try {
        const participation = await findParticipationForUserById(
          currentUserId,
          currentParticipationId,
        );

        if (cancelled) return;

        if (!participation) {
          setNotFound(true);
          return;
        }

        setData(participation);
      } catch (error) {
        if (!cancelled) setErrorMessage(toParticipationError(error).message);
      }
    }

    void loadParticipation();

    return () => {
      cancelled = true;
    };
  }, [participationId, requestVersion, userId]);

  return {
    data,
    errorMessage,
    notFound,
    refresh: () => setRequestVersion((version) => version + 1),
  };
}
