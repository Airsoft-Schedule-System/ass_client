import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      'fsd/import-locality': 'error',
    },
  },
  {
    files: ['./src/features/**'],
    rules: {
      // 재사용 횟수와 무관하게 독립적인 제품 행동으로 유지할 feature를 허용한다.
      'fsd/insignificant-slice': 'off',
    },
  },
]);
