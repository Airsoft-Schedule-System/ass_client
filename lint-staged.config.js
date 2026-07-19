// 커밋에 포함될 파일만 lint와 formatting으로 자동 정리

export default {
  '*.{js,mjs,cjs,jsx,ts,tsx}': ['oxlint --fix', 'prettier --write'],
  '*.{json,css,md,html,yml,yaml}': 'prettier --write',
};
