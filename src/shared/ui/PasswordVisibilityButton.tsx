// 비밀번호 입력값의 표시 여부를 전환하는 인증 공통 버튼

import { EyeIcon } from './icons/EyeIcon';

type PasswordVisibilityButtonProps = {
  isVisible: boolean; // 현재 비밀번호가 화면에 표시되는지 여부
  onToggle: () => void; // 비밀번호 표시 여부를 전환할 때 실행할 함수
};

export function PasswordVisibilityButton({ isVisible, onToggle }: PasswordVisibilityButtonProps) {
  return (
    <button
      aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
      aria-pressed={isVisible}
      className="flex size-10 cursor-pointer items-center justify-center rounded-md text-[var(--color-app-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
      onClick={onToggle}
      type="button"
    >
      <EyeIcon />
    </button>
  );
}
