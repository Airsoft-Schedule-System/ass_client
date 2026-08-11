// 완료 상태를 나타내는 공통 체크 아이콘

type CheckIconProps = {
  className?: string; // 아이콘을 사용하는 위치에 맞춘 크기 클래스
};

export function CheckIcon({ className = 'size-8' }: CheckIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
