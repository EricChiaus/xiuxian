import { Equipment, ElementType, getElementName } from '../types/game';

const STAT_LABELS: Record<string, string> = {
  pa: '物攻',
  ma: '魔攻',
  pd: '物防',
  md: '魔防',
  maxHp: '生命',
  maxMp: '法力',
  metal: '金',
  wood: '木',
  water: '水',
  fire: '火',
  earth: '土',
  yin: '阴',
  yang: '阳'
};

export interface ComparisonRow {
  label: string;
  current: number;
  next: number;
  diff: number;
}

export const getItemDetailLines = (equipment: Equipment): string[] => {
  const lines: string[] = [];

  if (equipment.bonus?.pa) lines.push(`物攻 +${equipment.bonus.pa}`);
  if (equipment.bonus?.ma) lines.push(`魔攻 +${equipment.bonus.ma}`);
  if (equipment.bonus?.pd) lines.push(`物防 +${equipment.bonus.pd}`);
  if (equipment.bonus?.md) lines.push(`魔防 +${equipment.bonus.md}`);
  if (equipment.bonus?.maxHp) lines.push(`生命 +${equipment.bonus.maxHp}`);
  if (equipment.bonus?.maxMp) lines.push(`法力 +${equipment.bonus.maxMp}`);

  Object.entries(equipment.elements)
    .filter(([, value]) => (value ?? 0) > 0)
    .forEach(([element, value]) => {
      lines.push(`${getElementName(element as ElementType)} ${Math.floor(value ?? 0)}`);
    });

  return lines;
};

export const getComparisonRows = (item: Equipment, equippedItem?: Equipment): ComparisonRow[] => {
  const rows: ComparisonRow[] = [];

  const pushRow = (key: keyof typeof STAT_LABELS, next: number | undefined, current: number | undefined) => {
    if (!next) return;
    rows.push({
      label: STAT_LABELS[key],
      current: current ?? 0,
      next,
      diff: next - (current ?? 0)
    });
  };

  pushRow('pa', item.bonus?.pa, equippedItem?.bonus?.pa);
  pushRow('ma', item.bonus?.ma, equippedItem?.bonus?.ma);
  pushRow('pd', item.bonus?.pd, equippedItem?.bonus?.pd);
  pushRow('md', item.bonus?.md, equippedItem?.bonus?.md);
  pushRow('maxHp', item.bonus?.maxHp, equippedItem?.bonus?.maxHp);
  pushRow('maxMp', item.bonus?.maxMp, equippedItem?.bonus?.maxMp);

  Object.entries(item.elements).forEach(([element, value]) => {
    if (!value || value <= 0) return;
    const current = equippedItem?.elements?.[element as keyof typeof item.elements] ?? 0;
    rows.push({
      label: STAT_LABELS[element] ?? element,
      current,
      next: value,
      diff: value - current
    });
  });

  return rows;
};
