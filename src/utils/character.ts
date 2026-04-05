import { Character } from '../types/game';

export const createInitialCharacter = (): Character => ({
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  pa: 10,  // Physical Attack
  ma: 8,   // Magic Attack
  pd: 5,   // Physical Defense
  md: 5,   // Magic Defense
  level: 1,
  exp: 0,
  expToNext: 100,
  coin: 0,
  inventory: [],
  avatar: 'male_cultivator_1', // Default avatar
  equippedItems: {}, // No items equipped initially
  powers: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 }, // No powers initially
  powerResistance: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 } // No resistance initially
});

export const calculateStats = (character: Character): Character => {
  const levelMultiplier = 1 + (character.level - 1) * 0.15;
  
  const newCharacter = {
    ...character,
    maxHp: Math.floor(100 * levelMultiplier),
    maxMp: Math.floor(50 * levelMultiplier),
    pa: Math.floor(10 * levelMultiplier),
    ma: Math.floor(8 * levelMultiplier),
    pd: Math.floor(5 * levelMultiplier),
    md: Math.floor(4 * levelMultiplier),
  };

  // Restore full HP/MP on level up
  if (newCharacter.hp > newCharacter.maxHp) {
    newCharacter.hp = newCharacter.maxHp;
  }
  if (newCharacter.mp > newCharacter.maxMp) {
    newCharacter.mp = newCharacter.maxMp;
  }

  return newCharacter;
};

export const canLevelUp = (character: Character): boolean => {
  return character.exp >= character.expToNext;
};

export const levelUp = (character: Character): Character => {
  if (!canLevelUp(character)) {
    return character;
  }

  let newCharacter = { ...character };
  newCharacter.level++;
  newCharacter.exp -= newCharacter.expToNext;
  newCharacter.expToNext = Math.floor(100 * Math.pow(1.2, newCharacter.level - 1));
  
  return calculateStats(newCharacter);
};

export const gainExp = (character: Character, amount: number): Character => {
  let newCharacter = { ...character, exp: character.exp + amount };
  
  // Handle level down if exp goes negative
  while (newCharacter.exp < 0 && newCharacter.level > 1) {
    newCharacter.level--;
    newCharacter.exp += newCharacter.expToNext;
    newCharacter.expToNext = Math.floor(100 * Math.pow(1.2, newCharacter.level - 1));
    newCharacter = calculateStats(newCharacter);
  }
  
  if (newCharacter.exp < 0) newCharacter.exp = 0;
  
  return newCharacter;
};

export const restoreHp = (character: Character, amount: number): Character => {
  const newHp = Math.min(character.hp + amount, character.maxHp);
  return { ...character, hp: newHp };
};

export const restoreMp = (character: Character, amount: number): Character => {
  const newMp = Math.min(character.mp + amount, character.maxMp);
  return { ...character, mp: newMp };
};

export const takeDamage = (character: Character, damage: number): Character => {
  const newHp = Math.max(0, character.hp - damage);
  return { ...character, hp: newHp };
};

export const useMp = (character: Character, amount: number): Character => {
  const newMp = Math.max(0, character.mp - amount);
  return { ...character, mp: newMp };
};

export const regenerateHpMpExp = (character: Character, hpRegenRate: number, mpRegenRate: number, expRegenRate: number): Character => {
  const newHp = Math.min(character.maxHp, character.hp + hpRegenRate);
  const newMp = Math.min(character.maxMp, character.mp + mpRegenRate);
  const newExp = character.exp + expRegenRate;
  return { ...character, hp: newHp, mp: newMp, exp: newExp };
};

export const calculateRegenerationRates = (level: number): { hpPerSecond: number; mpPerSecond: number; expPerSecond: number } => {
  const baseHpRegen = 4.5; // 3x faster than previous (1.5)
  const baseMpRegen = 1.8; // 3x faster than previous (0.6)
  const baseExpRate = 0.1; // New: 0.1 EXP per second when idle
  
  return {
    hpPerSecond: baseHpRegen + (level - 1) * 0.9, // 3x faster scaling
    mpPerSecond: baseMpRegen + (level - 1) * 0.45, // 3x faster scaling
    expPerSecond: baseExpRate + (level - 1) * 0.02 // EXP scales with level
  };
};

export const calculateTurnRegeneration = (level: number): { hpRegen: number; mpRegen: number } => {
  return {
    hpRegen: Math.floor(2 + level * 0.5),
    mpRegen: Math.floor(1 + level * 0.3)
  };
};
