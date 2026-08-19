// 회원가입 완료 후 페이지가 표시할 결과 모델

export type SignUpResult = {
  displayName: string; // 완료 화면에 표시할 가입자 닉네임
  requiresEmailConfirmation: boolean; // 로그인 전 이메일 인증이 필요한지 여부
};
