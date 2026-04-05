export interface Character {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  pa: number;  // Physical Attack
  ma: number;  // Magic Attack
  pd: number;  // Physical Defense
  md: number;  // Magic Defense
  level: number;
  exp: number;
  expToNext: number;
  coin: number;
  inventory: string[]; // Simple inventory system
  avatar: string; // Player's chosen avatar
  equippedItems: {
    weapon?: string;
    armor?: string;
  }; // Currently equipped items
  powers: Powers; // Elemental powers
  powerResistance: PowerResistance; // Elemental resistance
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  level: number; // Equipment level 1-5
  bonus: {
    pa?: number;
    ma?: number;
    pd?: number;
    md?: number;
    maxHp?: number;
    maxMp?: number;
  };
  powers: Partial<Powers>; // Elemental powers this equipment provides
  powerResistance: Partial<PowerResistance>; // Elemental resistance this equipment provides
  price: number;
  sellPrice: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'equipment';
  effect?: string;
}

export interface Enemy {
  id: string; // Add unique ID for tracking
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  pa: number;
  pd: number;
  ma: number;
  md: number;
  expReward: number;
  coinReward: number;
  hasMagic: boolean;
  hasHeal: boolean;
  isElite?: boolean; // Elite enemy flag
  powers: Partial<Powers>; // Enemy elemental powers
  powerResistance: Partial<PowerResistance>; // Enemy elemental resistance
}

export interface EnemyType {
  name: string;
  baseHp: number;
  basePa: number;
  basePd: number;
  expReward: number;
  coinReward: number;
}

export interface GameState {
  player: Character;
  currentEnemy: Enemy | null;
  enemies: Enemy[]; // Multiple enemies in battle
  selectedEnemyId: string | null; // Currently selected enemy
  inBattle: boolean;
  isPlayerTurn: boolean; // Track whose turn it is
  battleLog: BattleLogEntry[];
  lastSaveTime: number;
  lastRegenerationTime: number;
  offlineExp: number;
  shopItems: ShopItem[];
  playerEquipment: Equipment[];
}

export interface BattleLogEntry {
  message: string;
  type: 'player' | 'enemy' | 'system';
  timestamp: number;
}

export type BattleAction = 'attack' | 'magic' | 'heal';

export interface GameSaveData {
  player: Character;
  lastSaveTime: number;
}

// Cultivator level names with sub-levels
export const getCultivatorLevelName = (level: number): string => {
  if (level >= 1 && level <= 9) {
    const subLevel = level;
    return `炼气期${subLevel}阶`;
  }
  if (level >= 10 && level <= 19) {
    const subLevel = level - 9;
    return `筑基期${subLevel}阶`;
  }
  if (level >= 20 && level <= 29) {
    const subLevel = level - 19;
    return `金丹期${subLevel}阶`;
  }
  if (level >= 30 && level <= 39) {
    const subLevel = level - 29;
    return `元婴期${subLevel}阶`;
  }
  if (level >= 40 && level <= 49) {
    const subLevel = level - 39;
    return `化神期${subLevel}阶`;
  }
  if (level >= 50 && level <= 59) {
    const subLevel = level - 49;
    return `炼虚期${subLevel}阶`;
  }
  if (level >= 60 && level <= 69) {
    const subLevel = level - 59;
    return `合体期${subLevel}阶`;
  }
  if (level >= 70 && level <= 79) {
    const subLevel = level - 69;
    return `大乘期${subLevel}阶`;
  }
  if (level >= 80 && level <= 89) {
    const subLevel = level - 79;
    return `渡劫期${subLevel}阶`;
  }
  if (level >= 90) {
    const subLevel = level - 89;
    return `大罗金仙${subLevel}阶`;
  }
  return '凡人';
};

// Get just the realm name (without sub-levels) for compact displays
export const getCultivatorRealmName = (level: number): string => {
  if (level >= 1 && level <= 9) return '炼气期';
  if (level >= 10 && level <= 19) return '筑基期';
  if (level >= 20 && level <= 29) return '金丹期';
  if (level >= 30 && level <= 39) return '元婴期';
  if (level >= 40 && level <= 49) return '化神期';
  if (level >= 50 && level <= 59) return '炼虚期';
  if (level >= 60 && level <= 69) return '合体期';
  if (level >= 70 && level <= 79) return '大乘期';
  if (level >= 80 && level <= 89) return '渡劫期';
  if (level >= 90) return '大罗金仙';
  return '凡人';
};

// Power system types
export type PowerType = 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'yin' | 'yang';

export interface Powers {
  metal: number;
  wood: number;
  water: number;
  fire: number;
  earth: number;
  yin: number;
  yang: number;
}

export interface PowerResistance {
  metal: number;
  wood: number;
  water: number;
  fire: number;
  earth: number;
  yin: number;
  yang: number;
}

export const getPowerColor = (power: PowerType): string => {
  switch (power) {
    case 'metal': return '#C0C0C0'; // Silver
    case 'wood': return '#228B22'; // Forest Green
    case 'water': return '#4169E1'; // Royal Blue
    case 'fire': return '#FF4500'; // Orange Red
    case 'earth': return '#8B4513'; // Saddle Brown
    case 'yin': return '#2F4F4F'; // Dark Slate Gray
    case 'yang': return '#FFD700'; // Gold
    default: return '#FFFFFF';
  }
};

export const getPowerName = (power: PowerType): string => {
  switch (power) {
    case 'metal': return '金';
    case 'wood': return '木';
    case 'water': return '水';
    case 'fire': return '火';
    case 'earth': return '土';
    case 'yin': return '阴';
    case 'yang': return '阳';
    default: return '无';
  }
};

// Element interaction rules (Chinese Wu Xing with Yin/Yang)
export const getPowerMultiplier = (attackerPower: PowerType, defenderPower: PowerType): number => {
  // Wu Xing (Five Elements) cycle: Wood → Earth → Metal → Water → Fire → Wood
  // Yin/Yang: Yin resists Yang, Yang resists Yin
  
  if (attackerPower === defenderPower) return 1.0; // Same element, neutral
  
  // Wu Xing interactions
  if (attackerPower === 'wood' && defenderPower === 'earth') return 1.5; // Wood overcomes Earth
  if (attackerPower === 'earth' && defenderPower === 'metal') return 1.5; // Earth overcomes Metal
  if (attackerPower === 'metal' && defenderPower === 'water') return 1.5; // Metal overcomes Water
  if (attackerPower === 'water' && defenderPower === 'fire') return 1.5; // Water overcomes Fire
  if (attackerPower === 'fire' && defenderPower === 'wood') return 1.5; // Fire overcomes Wood
  
  // Reverse cycle (weaker against)
  if (attackerPower === 'earth' && defenderPower === 'wood') return 0.7; // Earth is weak against Wood
  if (attackerPower === 'metal' && defenderPower === 'earth') return 0.7; // Metal is weak against Earth
  if (attackerPower === 'water' && defenderPower === 'metal') return 0.7; // Water is weak against Metal
  if (attackerPower === 'fire' && defenderPower === 'water') return 0.7; // Fire is weak against Water
  if (attackerPower === 'wood' && defenderPower === 'fire') return 0.7; // Wood is weak against Fire
  
  // Yin/Yang interactions
  if (attackerPower === 'yin' && defenderPower === 'yang') return 1.3; // Yin overcomes Yang
  if (attackerPower === 'yang' && defenderPower === 'yin') return 1.3; // Yang overcomes Yin
  
  return 1.0; // Neutral interaction
};
