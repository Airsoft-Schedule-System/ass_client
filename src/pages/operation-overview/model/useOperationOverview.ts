// 게임 운영 권한을 확인하고 개요에 필요한 정보와 승인 대기 집계를 조회

import { useEffect, useState } from 'react';
import {
  findSessionById,
  listParticipationsBySession,
  SessionAppError,
  toParticipationError,
  toSessionError,
} from '@/shared/api';
import type { SessionDetail } from '@/shared/api';

type OperationOverviewData = {
  session: SessionDetail; // 운영 권한이 확인된 게임 정보
  pendingApprovalCount: number | null; // 승인 대기 인원이며 집계 실패 시 null
};

type OperationOverviewResult = {
  sessionId: string; // 응답이 속한 게임 ID
  userId: string; // 조회를 요청한 사용자 ID
  requestVersion: number; // 재시도 전 응답과 구분할 요청 번호
  data: OperationOverviewData | null; // 조회에 성공한 운영 개요
  error: SessionAppError | null; // 게임 조회 실패 또는 접근 제한
  notFound: boolean; // 요청한 게임이 존재하지 않는지 여부
};

export function useOperationOverview(sessionId: string | undefined, userId: string | undefined) {
  const [result, setResult] = useState<OperationOverviewResult | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!sessionId || !userId) return;

    let cancelled = false;
    const currentSessionId = sessionId;
    const currentUserId = userId;

    async function loadOverview() {
      let data: OperationOverviewData | null = null;
      let error: SessionAppError | null = null;
      let notFound = false;

      try {
        const session = await findSessionById(currentSessionId);
        if (cancelled) return;

        if (!session) {
          notFound = true;
        } else if (session.createdByUserId !== currentUserId) {
          error = new SessionAppError('permission_denied', '이 게임을 관리할 권한이 없습니다.');
        } else {
          // 참가자 개인정보는 집계에만 사용하고 React 상태에는 남기지 않는다.
          let pendingApprovalCount: number | null = null;
          try {
            const participants = await listParticipationsBySession(currentSessionId);
            pendingApprovalCount = participants.filter(
              (participant) => participant.status === 'pendingApproval',
            ).length;
          } catch (cause) {
            const participationError = toParticipationError(cause);
            // 조회 도중 권한이 사라진 경우를 단순한 집계 실패로 숨기지 않는다.
            if (participationError.code === 'permission_denied') {
              throw new SessionAppError(
                'permission_denied',
                '이 게임을 관리할 권한이 없습니다.',
                cause,
              );
            }
            if (participationError.code === 'unauthenticated') {
              throw new SessionAppError('unauthenticated', participationError.message, cause);
            }
          }
          data = { session, pendingApprovalCount };
        }
      } catch (cause) {
        error = toSessionError(cause);
      }

      if (!cancelled) {
        setResult({
          sessionId: currentSessionId,
          userId: currentUserId,
          requestVersion,
          data,
          error,
          notFound,
        });
      }
    }

    void loadOverview();
    return () => {
      cancelled = true;
    };
  }, [requestVersion, sessionId, userId]);

  // effect 정리 전 렌더에서도 다른 사용자·게임·재시도의 이전 정보를 노출하지 않는다.
  const currentResult =
    result?.sessionId === sessionId &&
    result?.userId === userId &&
    result?.requestVersion === requestVersion
      ? result
      : null;

  return {
    data: currentResult?.data ?? null,
    errorMessage: currentResult?.error?.message ?? null,
    notFound: currentResult?.notFound === true || currentResult?.error?.code === 'not_found',
    forbidden: currentResult?.error?.code === 'permission_denied',
    retry: () => setRequestVersion((version) => version + 1),
  };
}
