// 본인이 만든 게임과 게임별 승인 대기 인원의 조회·재시도를 관리

import { useEffect, useState } from 'react';
import { listOwnedSessions, listParticipationsBySession, toSessionError } from '@/shared/api';
import type { SessionSummary } from '@/shared/api';

export type OperationListItem = {
  session: SessionSummary; // 본인이 만든 게임 정보
  pendingApprovalCount: number | null; // 승인 대기 인원이며 조회 실패 시 null
};

export function useOperationList(userId: string | undefined) {
  const [data, setData] = useState<OperationListItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadOperations() {
      setData(null);
      setErrorMessage(null);
      if (!userId) return;

      try {
        const sessions = await listOwnedSessions(userId);
        if (cancelled) return;

        // 개별 집계 실패가 다른 게임을 숨기지 않도록 결과를 각각 처리한다.
        const items = await Promise.all(
          sessions.map(async (session): Promise<OperationListItem> => {
            try {
              const participants = await listParticipationsBySession(session.id);
              const pendingApprovalCount = participants.filter(
                (participant) => participant.status === 'pendingApproval',
              ).length;

              return { session, pendingApprovalCount };
            } catch {
              return { session, pendingApprovalCount: null };
            }
          }),
        );

        if (!cancelled) setData(items);
      } catch (error) {
        if (!cancelled) setErrorMessage(toSessionError(error).message);
      }
    }

    void loadOperations();

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
