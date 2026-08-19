// 게임 규칙 JSON을 상세 화면에서 표시할 항목 목록으로 변환

import type { Json, SessionDetail } from '@/shared/api';

function formatRuleValue(value: Json | undefined) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? '사용' : '사용 안 함';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function getRuleEntries(session: SessionDetail) {
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
