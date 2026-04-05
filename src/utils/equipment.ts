import { Character } from '../types/game';

export interface ItemStats {
  pa?: number;
  ma?: number;
  pd?: number;
  md?: number;
  maxHp?: number;
  maxMp?: number;
}

export const getItemStats = (itemId: string): ItemStats => {
  switch (itemId) {
    // Weapons
    case 'sword1':
      return { pa: 5 };
    case 'sword2':
      return { pa: 10 };
    case 'staff1':
      return { ma: 5 };
    case 'staff2':
      return { ma: 12 };
    
    // Armor
    case 'armor1':
      return { pd: 3 };
    case 'armor2':
      return { pd: 6 };
    case 'armor3':
      return { md: 4 };
    case 'armor4':
      return { md: 8 };
    
    default:
      return {};
  }
};

export const calculateCharacterStats = (character: Character): Character => {
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
  
  // Apply weapon bonuses
  if (character.equippedItems.weapon) {
    const weaponStats = getItemStats(character.equippedItems.weapon);
    stats.pa = (baseCharacter.pa || 0) + (weaponStats.pa || 0);
    stats.ma = (baseCharacter.ma || 0) + (weaponStats.ma || 0);
  } else {
    stats.pa = baseCharacter.pa || 0;
    stats.ma = baseCharacter.ma || 0;
  }
  
  // Apply armor bonuses
  if (character.equippedItems.armor) {
    const armorStats = getItemStats(character.equippedItems.armor);
    stats.pd = (baseCharacter.pd || 0) + (armorStats.pd || 0);
    stats.md = (baseCharacter.md || 0) + (armorStats.md || 0);
    stats.maxHp = (baseCharacter.maxHp || 0) + (armorStats.maxHp || 0);
    stats.maxMp = (baseCharacter.maxMp || 0) + (armorStats.maxMp || 0);
  } else {
    stats.pd = baseCharacter.pd || 0;
    stats.md = baseCharacter.md || 0;
    stats.maxHp = baseCharacter.maxHp || 0;
    stats.maxMp = baseCharacter.maxMp || 0;
  }
  
  // Ensure HP and MP don't exceed new max values
  stats.hp = Math.min(stats.hp, stats.maxHp);
  stats.mp = Math.min(stats.mp, stats.maxMp);
  
  return stats;
};

export const equipItem = (character: Character, itemId: string): Character => {
  // Check if item is a weapon or armor
  const isWeapon = itemId.includes('sword') || itemId.includes('staff');
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
