import { Enemy, EnemyType } from '../types/game';

export const enemyTypes: EnemyType[] = [
  { name: "小妖", baseHp: 50, basePa: 8, basePd: 3, expReward: 20, coinReward: 10 },
  { name: "妖兽", baseHp: 40, basePa: 6, basePd: 2, expReward: 15, coinReward: 8 },
  { name: "狼妖", baseHp: 60, basePa: 12, basePd: 4, expReward: 25, coinReward: 12 },
  { name: "魔兵", baseHp: 80, basePa: 15, basePd: 6, expReward: 35, coinReward: 18 },
  { name: "骷髅怪", baseHp: 55, basePa: 10, basePd: 5, expReward: 22, coinReward: 11 }
];

export const generateEnemy = (playerLevel: number): Enemy => {
  const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  const levelVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  const enemyLevel = Math.max(1, playerLevel + levelVariation);
  const levelMultiplier = 1 + (enemyLevel - 1) * 0.1;
  
  return {
    name: enemyType.name,
    level: enemyLevel,
    hp: Math.floor(enemyType.baseHp * levelMultiplier),
    maxHp: Math.floor(enemyType.baseHp * levelMultiplier),
    pa: Math.floor(enemyType.basePa * levelMultiplier),
    pd: Math.floor(enemyType.basePd * levelMultiplier),
    ma: Math.floor(6 * levelMultiplier),
    md: Math.floor(3 * levelMultiplier),
    expReward: Math.floor(enemyType.expReward * levelMultiplier),
    coinReward: Math.floor(enemyType.coinReward * levelMultiplier),
    hasMagic: Math.random() > 0.5,
    hasHeal: Math.random() > 0.8
  };
};

export const chooseEnemyAction = (enemy: Enemy): 'attack' | 'magic' | 'heal' => {
  const actions: Array<'attack' | 'magic' | 'heal'> = ['attack'];
  if (enemy.hasMagic) actions.push('magic');
  if (enemy.hasHeal && enemy.hp < enemy.maxHp * 0.5) {
    actions.push('heal');
  }
  return actions[Math.floor(Math.random() * actions.length)];
};

export const calculateDamage = (
  attackerAttack: number,
  defenderDefense: number,
  variance: number = 5
): number => {
  return Math.max(1, attackerAttack - defenderDefense + Math.floor(Math.random() * variance));
};

export const calculateHeal = (magicAttack: number, variance: number = 10): number => {
  return Math.floor(magicAttack * 1.5 + Math.floor(Math.random() * variance));
};
