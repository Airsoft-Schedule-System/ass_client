export default {
  '*.{js,mjs,cjs,jsx,ts,tsx}': ['oxlint --fix', 'prettier --write'],
  '*.{json,css,md,html,yml,yaml}': 'prettier --write',
};
