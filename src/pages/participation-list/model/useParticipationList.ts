// 현재 사용자의 참가 목록 조회 상태와 재시도를 관리

import { useEffect, useState } from 'react';
import { listParticipationsForUser, toParticipationError } from '@/shared/api';
import type { UserParticipation } from '@/shared/api';

export function useParticipationList(userId: string | undefined) {
  const [data, setData] = useState<UserParticipation[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    const currentUserId = userId;

    async function loadParticipations() {
      setData(null);
      setErrorMessage(null);

      try {
        const participations = await listParticipationsForUser(currentUserId);
        if (!cancelled) setData(participations);
      } catch (error) {
        if (!cancelled) setErrorMessage(toParticipationError(error).message);
      }
    }

    void loadParticipations();

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
