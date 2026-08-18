// 선택한 게임의 상세 정보와 현재 사용자의 참가·운영 상태를 표시

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  formatGameFee,
  formatPaymentMethod,
  formatSessionDateTime,
  GameSessionStatusBadge,
} from '@/entities/game-session';
import { ParticipationStatusBadge } from '@/entities/participation';
import { useViewerStore } from '@/entities/viewer';
import {
  findParticipationForUserAndSession,
  findSessionById,
  ParticipationAppError,
  toSessionError,
} from '@/shared/api';
import type { Json, ParticipationSummary, SessionDetail } from '@/shared/api';
import { Button, CalendarIcon, MapPinIcon, UsersIcon, WalletIcon } from '@/shared/ui';
import { MobileLayout } from '@/widgets/mobile-layout';

type GameDetailData = {
  participation: ParticipationSummary | null; // 현재 사용자의 이 게임 참가 상태
  session: SessionDetail; // 상세 화면에 표시할 게임 세션
};

// 세션과 참가 API 중 실패한 도메인의 사용자 메시지를 선택
function getGameDetailErrorMessage(error: unknown) {
  if (error instanceof ParticipationAppError) return error.message;
  return toSessionError(error).message;
}

// 규칙 JSON의 값을 사용자가 읽을 수 있는 한 줄 문구로 변환
function formatRuleValue(value: Json | undefined) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? '사용' : '사용 안 함';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// 프리셋 또는 커스텀 규칙을 상세 화면용 항목 목록으로 변환
function getRuleEntries(session: SessionDetail) {
  const rules = session.presetRules ?? session.customRules;
  if (!rules) return [];

  if (Array.isArray(rules)) {
    return rules.map((value, index) => [`규칙 ${index + 1}`, formatRuleValue(value)] as const);
  }

  if (typeof rules === 'object') {
    return Object.entries(rules).map(([label, value]) => [label, formatRuleValue(value)] as const);
  }

  return [['게임룰', formatRuleValue(rules)] as const];
}

export function GameDetailPage() {
  const [data, setData] = useState<GameDetailData | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const user = useViewerStore((state) => state.user);

  useEffect(() => {
    if (!sessionId || !user) return;

    let cancelled = false;
    const currentSessionId = sessionId;
    const userId = user.id;

    // 게임 상세와 사용자 참가 상태를 병렬로 조회
    async function loadGameDetail() {
      setData(null);
      setLoadErrorMessage(null);
      setNotFound(false);

      try {
        const [session, participation] = await Promise.all([
          findSessionById(currentSessionId),
          findParticipationForUserAndSession(userId, currentSessionId),
        ]);

        if (cancelled) return;

        if (!session) {
          setNotFound(true);
          return;
        }

        setData({ participation, session });
      } catch (error) {
        if (!cancelled) setLoadErrorMessage(getGameDetailErrorMessage(error));
      }
    }

    void loadGameDetail();

    return () => {
      cancelled = true;
    };
  }, [requestVersion, sessionId, user]);

  // 공통 레이아웃 안에 표시할 조회 상태별 콘텐츠를 반환
  function renderGameDetailContent() {
    if (!sessionId || notFound) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-base font-bold text-[var(--color-app-foreground)]">
            게임을 찾을 수 없습니다
          </p>
          <button
            className="text-sm font-bold text-[var(--color-app-brand)] underline underline-offset-4 enabled:cursor-pointer"
            onClick={() => navigate('/')}
            type="button"
          >
            게임 목록으로 돌아가기
          </button>
        </div>
      );
    }

    if (loadErrorMessage) {
      return (
        <div className="flex flex-col items-start gap-3 pt-4">
          <p className="text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
            {loadErrorMessage}
          </p>
          <button
            className="text-sm font-bold text-[var(--color-app-foreground)] underline underline-offset-4 enabled:cursor-pointer"
            onClick={() => setRequestVersion((version) => version + 1)}
            type="button"
          >
            다시 시도
          </button>
        </div>
      );
    }

    if (!data) {
      return (
        <p className="pt-4 text-sm text-[var(--color-app-muted)]" role="status">
          게임 정보를 불러오는 중
        </p>
      );
    }

    const { participation, session } = data;
    const isOwned = session.createdByUserId === user?.id;
    const ruleEntries = getRuleEntries(session);

    return (
      <article className="flex flex-col gap-5">
        <section className="flex flex-col gap-3 rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[var(--color-app-foreground)]">
                {session.title}
              </h2>
              {isOwned && (
                <p className="mt-1 text-xs font-semibold text-[var(--color-app-brand)]">
                  내가 만든 게임
                </p>
              )}
            </div>
            <GameSessionStatusBadge status={session.status} />
          </div>

          {participation && (
            <div className="flex items-center justify-between gap-3 border-t border-[var(--color-app-border)] pt-3">
              <span className="text-xs text-[var(--color-app-muted)]">내 참가 상태</span>
              <ParticipationStatusBadge status={participation.status} />
            </div>
          )}
        </section>

        <section aria-labelledby="game-information-title" className="flex flex-col gap-3">
          <h2
            className="text-base font-bold text-[var(--color-app-foreground)]"
            id="game-information-title"
          >
            게임 정보
          </h2>
          <dl className="divide-y divide-[var(--color-app-border)] rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4">
            <div className="flex gap-3 py-3">
              <dt className="flex size-5 shrink-0 items-center justify-center text-[var(--color-app-brand)]">
                <MapPinIcon />
                <span className="sr-only">장소</span>
              </dt>
              <dd className="min-w-0 text-sm text-[var(--color-app-foreground)]">
                <p className="font-semibold">{session.fieldName}</p>
                {session.fieldAddress && (
                  <p className="mt-1 text-xs text-[var(--color-app-muted)]">
                    {session.fieldAddress}
                  </p>
                )}
              </dd>
            </div>
            <div className="flex items-center gap-3 py-3">
              <dt className="flex size-5 shrink-0 items-center justify-center text-[var(--color-app-brand)]">
                <CalendarIcon />
                <span className="sr-only">일시</span>
              </dt>
              <dd className="text-sm text-[var(--color-app-foreground)]">
                {formatSessionDateTime(session.startsAt, session.endsAt)}
              </dd>
            </div>
            <div className="flex items-center gap-3 py-3">
              <dt className="flex size-5 shrink-0 items-center justify-center text-[var(--color-app-brand)]">
                <UsersIcon />
                <span className="sr-only">참가 인원</span>
              </dt>
              <dd className="text-sm text-[var(--color-app-foreground)]">
                확정 {session.confirmedCount}명 / 정원 {session.capacity}명
              </dd>
            </div>
            <div className="flex items-center gap-3 py-3">
              <dt className="flex size-5 shrink-0 items-center justify-center text-[var(--color-app-brand)]">
                <WalletIcon />
                <span className="sr-only">게임비와 결제 방식</span>
              </dt>
              <dd className="text-sm text-[var(--color-app-foreground)]">
                {formatGameFee(session.gameFee)} · {formatPaymentMethod(session.paymentMethod)}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="game-rules-title" className="flex flex-col gap-3">
          <div>
            <h2
              className="text-base font-bold text-[var(--color-app-foreground)]"
              id="game-rules-title"
            >
              게임룰
            </h2>
            {session.presetName && (
              <p className="mt-1 text-xs text-[var(--color-app-brand)]">{session.presetName}</p>
            )}
          </div>
          <dl className="divide-y divide-[var(--color-app-border)] rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4">
            {ruleEntries.length > 0 ? (
              ruleEntries.map(([label, value]) => (
                <div className="flex justify-between gap-4 py-3" key={label}>
                  <dt className="text-xs text-[var(--color-app-muted)]">{label}</dt>
                  <dd className="text-right text-xs font-medium text-[var(--color-app-foreground)]">
                    {value}
                  </dd>
                </div>
              ))
            ) : (
              <div className="py-3 text-sm text-[var(--color-app-muted)]">
                등록된 상세 게임룰이 없습니다.
              </div>
            )}
          </dl>
        </section>

        {isOwned && <Button onClick={() => navigate('/operations')}>운영하기</Button>}
      </article>
    );
  }

  return (
    <MobileLayout showBackButton title="게임 상세">
      {renderGameDetailContent()}
    </MobileLayout>
  );
}
