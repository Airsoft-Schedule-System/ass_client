// 로그인 사용자의 프로필과 계정 정보를 조회하고 관련 작업을 제공

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useViewerStore } from '@/entities/viewer';
import { getMyProfile, signOut, toAuthError, toProfileError } from '@/shared/api';
import type { UserProfile } from '@/shared/api';
import { Button, Card, UserIcon } from '@/shared/ui';
import { MobileLayout } from '@/widgets/mobile-layout';

const profileDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Supabase 날짜 문자열을 내 정보 화면에서 사용하는 한국어 날짜로 변환
function formatProfileDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : profileDateFormatter.format(date);
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [logoutErrorMessage, setLogoutErrorMessage] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const user = useViewerStore((state) => state.user);
  const setViewer = useViewerStore((state) => state.setViewer);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const userId = user.id;

    // 로그인 사용자와 연결된 앱 프로필을 화면에 표시
    async function loadProfile() {
      try {
        const currentProfile = await getMyProfile(userId);

        if (!cancelled) setProfile(currentProfile);
      } catch (error) {
        if (!cancelled) setLoadErrorMessage(toProfileError(error, 'load').message);
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Supabase 세션을 종료하고 인증 가드가 로그인 화면으로 전환하도록 상태를 비움
  async function handleLogout() {
    setLogoutErrorMessage(null);
    setIsLoggingOut(true);

    try {
      await signOut();
      setViewer(null);
    } catch (error) {
      setLogoutErrorMessage(toAuthError(error).message);
      setIsLoggingOut(false);
    }
  }

  // 공통 레이아웃 안에 표시할 조회 상태별 콘텐츠를 반환
  function renderProfileContent() {
    if (loadErrorMessage) {
      return (
        <p className="text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
          {loadErrorMessage}
        </p>
      );
    }

    if (!profile) {
      return (
        <p className="text-sm text-[var(--color-app-muted)]" role="status">
          프로필 정보를 불러오는 중
        </p>
      );
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-app-brand)_12%,transparent)] text-[var(--color-app-brand)]">
            <UserIcon />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-[var(--color-app-foreground)]">
              {profile.displayName}
            </p>
            <p className="truncate text-xs text-[var(--color-app-muted)]">
              {profile.teamName ?? '소속 팀 없음'}
            </p>
          </div>
        </Card>

        <Card>
          <dl className="divide-y divide-[var(--color-app-border)] px-4">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="shrink-0 text-xs text-[var(--color-app-muted)]">이메일</dt>
              <dd className="truncate text-right text-xs font-medium text-[var(--color-app-foreground)]">
                {profile.email ?? '-'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="shrink-0 text-xs text-[var(--color-app-muted)]">연락처</dt>
              <dd className="truncate text-right text-xs font-medium text-[var(--color-app-foreground)]">
                {profile.phoneNumber ?? '미등록'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="shrink-0 text-xs text-[var(--color-app-muted)]">가입 일자</dt>
              <dd className="text-right text-xs font-medium text-[var(--color-app-foreground)]">
                {formatProfileDate(profile.createdAt)}
              </dd>
            </div>
          </dl>
        </Card>

        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate('/profile/setup')}>내 정보 수정</Button>
          <button
            className="flex h-14 w-full items-center justify-center rounded-lg border border-red-500 bg-transparent px-4 text-sm font-bold text-red-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 enabled:cursor-pointer enabled:hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? '로그아웃 중' : '로그아웃'}
          </button>
        </div>

        {logoutErrorMessage && (
          <p className="text-sm font-semibold text-red-500" role="alert">
            {logoutErrorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <MobileLayout
      description="프로필과 계정 정보를 관리하세요"
      showBottomNavigation
      title="내 정보"
    >
      {renderProfileContent()}
    </MobileLayout>
  );
}
