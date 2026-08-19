// 선택한 게임의 상세 정보와 현재 사용자의 참가·운영 상태를 표시

import { useNavigate, useParams } from 'react-router';
import {
  formatGameFee,
  formatPaymentMethod,
  formatSessionDateTime,
  GameSessionStatusBadge,
} from '@/entities/game-session';
import { ParticipationStatusBadge } from '@/entities/participation';
import { useViewerStore } from '@/entities/viewer';
import { Button, CalendarIcon, MapPinIcon, UsersIcon, WalletIcon } from '@/shared/ui';
import { MobileLayout } from '@/widgets/mobile-layout';
import { getRuleEntries } from '../lib/getRuleEntries';
import { useGameDetail } from '../model/useGameDetail';

export function GameDetailPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const user = useViewerStore((state) => state.user);
  const { data, errorMessage, notFound, retry } = useGameDetail(sessionId, user?.id);

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

    if (errorMessage) {
      return (
        <div className="flex flex-col items-start gap-3 pt-4">
          <p className="text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
            {errorMessage}
          </p>
          <button
            className="text-sm font-bold text-[var(--color-app-foreground)] underline underline-offset-4 enabled:cursor-pointer"
            onClick={retry}
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
