import { Character, Equipment } from '../types/game';

export interface ItemStats {
  pa?: number;
  ma?: number;
  pd?: number;
  md?: number;
  maxHp?: number;
  maxMp?: number;
}

export const generateEquipment = (id: string, type: 'weapon' | 'armor' | 'accessory', level: number): Equipment => {
  const baseStats = getBaseStats(type);
  const levelMultiplier = 1 + (level - 1) * 0.5; // 50% increase per level
  const basePrice = getBasePrice(type);
  const price = Math.floor(basePrice * levelMultiplier);
  
  return {
    id,
    name: getEquipmentName(type, level),
    type,
    level,
    bonus: {
      pa: baseStats.pa ? Math.floor(baseStats.pa * levelMultiplier) : undefined,
      ma: baseStats.ma ? Math.floor(baseStats.ma * levelMultiplier) : undefined,
      pd: baseStats.pd ? Math.floor(baseStats.pd * levelMultiplier) : undefined,
      md: baseStats.md ? Math.floor(baseStats.md * levelMultiplier) : undefined,
      maxHp: baseStats.maxHp ? Math.floor(baseStats.maxHp * levelMultiplier) : undefined,
      maxMp: baseStats.maxMp ? Math.floor(baseStats.maxMp * levelMultiplier) : undefined
    },
    price,
    sellPrice: Math.floor(price * 0.5)
  };
};

const getBaseStats = (type: 'weapon' | 'armor' | 'accessory'): ItemStats => {
  switch (type) {
    case 'weapon':
      return { pa: 8, ma: 6 };
    case 'armor':
      return { pd: 5, md: 4, maxHp: 20, maxMp: 10 };
    case 'accessory':
      return { pa: 3, ma: 3, pd: 2, md: 2, maxHp: 10, maxMp: 5 };
    default:
      return {};
  }
};

const getBasePrice = (type: 'weapon' | 'armor' | 'accessory'): number => {
  switch (type) {
    case 'weapon': return 50;
    case 'armor': return 40;
    case 'accessory': return 30;
    default: return 20;
  }
};

const getEquipmentName = (type: 'weapon' | 'armor' | 'accessory', level: number): string => {
  const levelPrefix = ['', '精良', '稀有', '史诗', '传说', '神话'][level - 1] || '';
  const typeName = {
    weapon: ['铁剑', '钢剑', '灵剑', '仙剑', '神剑'],
    armor: ['布甲', '皮甲', '铁甲', '仙袍', '神袍'],
    accessory: ['木符', '玉符', '灵符', '仙符', '神符']
  };
  
  return levelPrefix + typeName[type][level - 1];
};

export const generateRandomEquipment = (playerLevel: number): Equipment => {
  const types: Array<'weapon' | 'armor' | 'accessory'> = ['weapon', 'armor', 'accessory'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Generate level based on player level (can be higher or lower)
  const levelVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
  const maxLevel = Math.min(5, Math.max(1, playerLevel + levelVariation));
  const level = Math.floor(Math.random() * maxLevel) + 1;
  
  return generateEquipment(`equipment_${Date.now()}_${Math.random()}`, type, level);
};

export const getItemStats = (equipment: Equipment): ItemStats => {
  return equipment.bonus;
};

export const calculateCharacterStats = (character: Character, allEquipment: Equipment[] = []): Character => {
  let stats = { ...character };
  
  // Reset to base stats (without equipment)
  const baseCharacter = {
    ...character,
    pa: 10 + Math.floor((character.level - 1) * 1.5),
    ma: 8 + Math.floor((character.level - 1) * 1.2),
    pd: 5 + Math.floor((character.level - 1) * 0.8),
    md: 5 + Math.floor((character.level - 1) * 0.8),
    maxHp: 100 + Math.floor((character.level - 1) * 10),
    maxMp: 50 + Math.floor((character.level - 1) * 5)
  };
  
  // Apply equipment bonuses
  let totalBonus: ItemStats = {};
  allEquipment.forEach(equipment => {
    if (equipment.bonus.pa) totalBonus.pa = (totalBonus.pa || 0) + equipment.bonus.pa;
    if (equipment.bonus.ma) totalBonus.ma = (totalBonus.ma || 0) + equipment.bonus.ma;
    if (equipment.bonus.pd) totalBonus.pd = (totalBonus.pd || 0) + equipment.bonus.pd;
    if (equipment.bonus.md) totalBonus.md = (totalBonus.md || 0) + equipment.bonus.md;
    if (equipment.bonus.maxHp) totalBonus.maxHp = (totalBonus.maxHp || 0) + equipment.bonus.maxHp;
    if (equipment.bonus.maxMp) totalBonus.maxMp = (totalBonus.maxMp || 0) + equipment.bonus.maxMp;
  });
  
  // Apply bonuses
  stats.pa = (baseCharacter.pa || 0) + (totalBonus.pa || 0);
  stats.ma = (baseCharacter.ma || 0) + (totalBonus.ma || 0);
  stats.pd = (baseCharacter.pd || 0) + (totalBonus.pd || 0);
  stats.md = (baseCharacter.md || 0) + (totalBonus.md || 0);
  stats.maxHp = (baseCharacter.maxHp || 0) + (totalBonus.maxHp || 0);
  stats.maxMp = (baseCharacter.maxMp || 0) + (totalBonus.maxMp || 0);
  
  // Ensure HP and MP don't exceed new max values
  stats.hp = Math.min(stats.hp, stats.maxHp);
  stats.mp = Math.min(stats.mp, stats.maxMp);
  
  return stats;
};

export const equipItem = (character: Character, itemId: string): Character => {
  // Check if item is a weapon or armor
  const isWeapon = itemId.includes('sword') || itemId.includes('staff') || itemId.includes('equipment');
  const isArmor = itemId.includes('armor');
  
  if (!isWeapon && !isArmor) {
    return character; // Not an equippable item
  }
  
  // Check if item is in inventory
  if (!character.inventory.includes(itemId)) {
    return character; // Item not in inventory
  }
  
  let newCharacter = { ...character };
  
  if (isWeapon) {
    // If there's already a weapon equipped, add it back to inventory
    if (character.equippedItems.weapon) {
      newCharacter.inventory = [...character.inventory, character.equippedItems.weapon];
    }
    
    // Equip new weapon and remove from inventory
    newCharacter.equippedItems.weapon = itemId;
    newCharacter.inventory = character.inventory.filter(id => id !== itemId);
  } else if (isArmor) {
    // If there's already armor equipped, add it back to inventory
    if (character.equippedItems.armor) {
      newCharacter.inventory = [...character.inventory, character.equippedItems.armor];
    }
    
    // Equip new armor and remove from inventory
    newCharacter.equippedItems.armor = itemId;
    newCharacter.inventory = character.inventory.filter(id => id !== itemId);
  }
  
  // Recalculate stats with new equipment
  newCharacter = calculateCharacterStats(newCharacter);
  
  return newCharacter;
};
