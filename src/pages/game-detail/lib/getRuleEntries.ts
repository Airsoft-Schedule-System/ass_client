// 게임 규칙 JSON을 상세 화면에서 표시할 항목 목록으로 변환

import type { Json, SessionDetail } from '@/shared/api';

type RuleEntry = readonly [label: string, value: string];

const structuredRuleKeys = new Set([
  'muzzleVelocityFps',
  'bbWeightGrams',
  'bioBbRequired',
  'magazineLimit',
  'noteBlocks',
]);

function formatRuleValue(value: Json | undefined) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? '사용' : '사용 안 함';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function isJsonObject(value: Json | undefined): value is { [key: string]: Json | undefined } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 최종 복사본으로 저장된 구조화 규칙과 추가 노트를 화면 항목으로 변환
export function getRuleEntries(session: SessionDetail) {
  const rules = session.customRules;
  if (!isJsonObject(rules)) return [['게임룰', formatRuleValue(rules)] as const];

  const entries: RuleEntry[] = [];

  if (typeof rules.muzzleVelocityFps === 'number') {
    entries.push(['탄속 제한', `${rules.muzzleVelocityFps} FPS`]);
  }

  if (typeof rules.bbWeightGrams === 'number') {
    entries.push(['BB탄 무게', `${rules.bbWeightGrams}g`]);
  }

  if (typeof rules.bioBbRequired === 'boolean') {
    entries.push(['바이오 BB탄', rules.bioBbRequired ? '필수' : '선택']);
  }

  if (typeof rules.magazineLimit === 'number') {
    entries.push(['탄창 제한', `${rules.magazineLimit}발`]);
  }

  if (Array.isArray(rules.noteBlocks)) {
    rules.noteBlocks.forEach((block) => {
      if (!isJsonObject(block) || typeof block.body !== 'string') return;

      const title =
        typeof block.title === 'string' && block.title.trim() ? block.title : '추가 규칙';
      entries.push([title, block.body]);
    });
  }

  Object.entries(rules).forEach(([key, value]) => {
    if (structuredRuleKeys.has(key)) return;

    entries.push([key, formatRuleValue(value)]);
  });

  return entries;
}
