import { Enemy, EnemyType, ElementType, Elements, ElementResistance } from '../types/game';

export const enemyTypes: EnemyType[] = [
  { name: "小妖", baseHp: 50, basePa: 8, basePd: 3, expReward: 20, coinReward: 10 },
  { name: "妖兽", baseHp: 40, basePa: 6, basePd: 2, expReward: 15, coinReward: 8 },
  { name: "狼妖", baseHp: 60, basePa: 12, basePd: 4, expReward: 25, coinReward: 12 },
  { name: "魔兵", baseHp: 80, basePa: 15, basePd: 6, expReward: 35, coinReward: 18 },
  { name: "骷髅怪", baseHp: 55, basePa: 10, basePd: 5, expReward: 22, coinReward: 11 }
];

export const eliteEnemyTypes: EnemyType[] = [
  { name: "精英小妖", baseHp: 100, basePa: 16, basePd: 6, expReward: 60, coinReward: 30 },
  { name: "精英妖兽", baseHp: 80, basePa: 12, basePd: 4, expReward: 45, coinReward: 24 },
  { name: "精英狼妖", baseHp: 120, basePa: 24, basePd: 8, expReward: 75, coinReward: 36 },
  { name: "精英魔兵", baseHp: 160, basePa: 30, basePd: 12, expReward: 105, coinReward: 54 },
  { name: "精英骷髅", baseHp: 110, basePa: 20, basePd: 10, expReward: 66, coinReward: 33 }
];

const generateEnemyPower = (isElite: boolean): Partial<Elements> => {
  const elements: Partial<Elements> = {};
  const ElementTypes: ElementType[] = ['metal', 'wood', 'water', 'fire', 'earth', 'yin', 'yang'];
  
  if (isElite) {
    // Elite enemies can have up to 2 Elements
    const powerCount = Math.random() < 0.7 ? 2 : 1;
    for (let i = 0; i < powerCount; i++) {
      const power = ElementTypes[Math.floor(Math.random() * ElementTypes.length)];
      const value = Math.floor(Math.random() * 5) + 3; // 3-7 power
      Elements[power] = value;
    }
  } else {
    // Normal enemies can have at most 1 power (50% chance)
    if (Math.random() < 0.5) {
      const power = ElementTypes[Math.floor(Math.random() * ElementTypes.length)];
      const value = Math.floor(Math.random() * 3) + 1; // 1-3 power
      Elements[power] = value;
    }
  }
  
  return Elements;
};

const generateEnemyResistance = (isElite: boolean, enemyelements: Partial<Elements>): Partial<ElementResistance> => {
  const resistance: Partial<ElementResistance> = {};
  
  // Enemies get resistance to their own power type
  Object.keys(enemyElements).forEach(power => {
    const powerKey = power as keyof ElementResistance;
    resistance[powerKey] = isElite ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 2) + 1; // 1-2 for normal, 2-4 for elite
  });
  
  return resistance;
};

export const generateEnemy = (playerLevel: number, id?: string, isElite: boolean = false): Enemy => {
  const enemyPool = isElite ? eliteEnemyTypes : enemyTypes;
  const enemyType = enemyPool[Math.floor(Math.random() * enemyPool.length)];
  const levelVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  const enemyLevel = Math.max(1, playerLevel + levelVariation);
  const levelMultiplier = 1 + (enemyLevel - 1) * 0.1;
  
  // Generate Elements and resistance
  const enemyElements = generateEnemyPower(isElite);
  const enemyResistance = generateEnemyResistance(isElite, enemyElements);
  
  return {
    id: id || `enemy_${Date.now()}_${Math.random()}`,
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
    hasHeal: Math.random() > 0.8,
    isElite: isElite,
    elements: enemyElements,
    elementResistance: enemyResistance
  };
};

export const generateMultipleEnemies = (playerLevel: number): Enemy[] => {
  const enemies: Enemy[] = [];
  const enemyCount = Math.random(); // 0-1 random
  
  let count: number;
  if (enemyCount < 0.5) {
    count = 1; // 50% chance for 1 enemy
  } else if (enemyCount < 0.75) {
    count = 2; // 25% chance for 2 enemies
  } else {
    count = 3; // 25% chance for 3 enemies
  }
  
  const eliteChance = 0.2; // 20% chance for elite enemies
  
  for (let i = 0; i < count; i++) {
    const isElite = Math.random() < eliteChance;
    enemies.push(generateEnemy(playerLevel, `enemy_${i}`, isElite));
  }
  return enemies;
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

export const calculateHeal = (magicAttack: number, variance: number = 15): number => {
  return Math.floor(magicAttack * 2.0 + Math.floor(Math.random() * variance));
};
