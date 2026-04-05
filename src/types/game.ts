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
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  bonus: {
    pa?: number;
    ma?: number;
    pd?: number;
    md?: number;
    maxHp?: number;
    maxMp?: number;
  };
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
