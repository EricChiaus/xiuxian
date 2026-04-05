import { Character, Equipment, ElementType, Elements, ElementResistance, getElementName } from '../types/game';

export interface ItemStats {
  pa?: number;
  ma?: number;
  pd?: number;
  md?: number;
  maxHp?: number;
  maxMp?: number;
}

const generateRandomElement = (): ElementType | null => {
  const elements: ElementType[] = ['metal', 'wood', 'water', 'fire', 'earth', 'yin', 'yang'];
  return Math.random() < 0.6 ? elements[Math.floor(Math.random() * elements.length)] : null; // 60% chance to have an element
};

const generateElementValue = (level: number): number => {
  return Math.floor(level * 2 + Math.random() * 3); // 2-5 element per equipment level
};

const generateElementResistanceValue = (level: number): number => {
  return Math.floor(level * 1.5 + Math.random() * 2); // 1.5-3.5 resistance per equipment level
};

export const generateEquipment = (id: string, type: 'weapon' | 'armor' | 'accessory', level: number): Equipment => {
  const baseStats = getBaseStats(type);
  const levelMultiplier = 1 + (level - 1) * 0.5; // 50% increase per level
  const basePrice = getBasePrice(type);
  const price = Math.floor(basePrice * levelMultiplier);
  
  // Generate elements and resistance
  const primaryElement = generateRandomElement();
  const secondaryElement = type === 'accessory' && Math.random() < 0.3 ? generateRandomElement() : null; // Accessories can have 2 elements
  
  const elements: Partial<Elements> = {};
  const elementResistance: Partial<ElementResistance> = {};
  
  if (primaryElement) {
    elements[primaryElement] = generateElementValue(level);
    elementResistance[primaryElement] = generateElementResistanceValue(level);
  }
  
  if (secondaryElement && secondaryElement !== primaryElement) {
    elements[secondaryElement] = generateElementValue(level);
    elementResistance[secondaryElement] = generateElementResistanceValue(level);
  }
  
  // All equipment types get some resistance to their primary element
  if (primaryElement) {
    elementResistance[primaryElement] = (elementResistance[primaryElement] || 0) + generateElementResistanceValue(level);
  }
  
  return {
    id,
    name: getEquipmentName(type, level, primaryElement),
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
    elements,
    elementResistance,
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

const getEquipmentName = (type: 'weapon' | 'armor' | 'accessory', level: number, element?: ElementType | null): string => {
  const levelPrefix = ['', '精良', '稀有', '史诗', '传说', '神话'][level - 1] || '';
  const elementPrefix = element ? getElementName(element) : '';
  
  const typeName = {
    weapon: ['铁剑', '钢剑', '灵剑', '仙剑', '神剑'],
    armor: ['布甲', '皮甲', '铁甲', '仙袍', '神袍'],
    accessory: ['木符', '玉符', '灵符', '仙符', '神符']
  };
  
  return levelPrefix + elementPrefix + typeName[type][level - 1];
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
    maxMp: 50 + Math.floor((character.level - 1) * 5),
    elements: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 },
    elementResistance: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 }
  };
  
  // Apply equipment bonuses
  let totalBonus: ItemStats = {};
  let totalElements: Partial<Elements> = {};
  let totalResistance: Partial<ElementResistance> = {};
  
  allEquipment.forEach(equipment => {
    // Apply stat bonuses
    if (equipment.bonus.pa) totalBonus.pa = (totalBonus.pa || 0) + equipment.bonus.pa;
    if (equipment.bonus.ma) totalBonus.ma = (totalBonus.ma || 0) + equipment.bonus.ma;
    if (equipment.bonus.pd) totalBonus.pd = (totalBonus.pd || 0) + equipment.bonus.pd;
    if (equipment.bonus.md) totalBonus.md = (totalBonus.md || 0) + equipment.bonus.md;
    if (equipment.bonus.maxHp) totalBonus.maxHp = (totalBonus.maxHp || 0) + equipment.bonus.maxHp;
    if (equipment.bonus.maxMp) totalBonus.maxMp = (totalBonus.maxMp || 0) + equipment.bonus.maxMp;
    
    // Apply element bonuses
    Object.keys(equipment.elements).forEach(element => {
      const elementKey = element as keyof Elements;
      totalElements[elementKey] = (totalElements[elementKey] || 0) + equipment.elements[elementKey]!;
    });
    
    // Apply resistance bonuses
    Object.keys(equipment.elementResistance).forEach(resistance => {
      const resistanceKey = resistance as keyof ElementResistance;
      totalResistance[resistanceKey] = (totalResistance[resistanceKey] || 0) + equipment.elementResistance[resistanceKey]!;
    });
  });
  
  // Apply bonuses to base stats
  stats.pa = (baseCharacter.pa || 0) + (totalBonus.pa || 0);
  stats.ma = (baseCharacter.ma || 0) + (totalBonus.ma || 0);
  stats.pd = (baseCharacter.pd || 0) + (totalBonus.pd || 0);
  stats.md = (baseCharacter.md || 0) + (totalBonus.md || 0);
  stats.maxHp = (baseCharacter.maxHp || 0) + (totalBonus.maxHp || 0);
  stats.maxMp = (baseCharacter.maxMp || 0) + (totalBonus.maxMp || 0);
  
  // Apply element bonuses to base elements
  stats.elements = { ...baseCharacter.elements };
  Object.keys(totalElements).forEach(element => {
    const elementKey = element as keyof Elements;
    stats.elements[elementKey] = (stats.elements[elementKey] || 0) + totalElements[elementKey]!;
  });
  
  // Apply resistance bonuses to base resistance
  stats.elementResistance = { ...baseCharacter.elementResistance };
  Object.keys(totalResistance).forEach(resistance => {
    const resistanceKey = resistance as keyof ElementResistance;
    stats.elementResistance[resistanceKey] = (stats.elementResistance[resistanceKey] || 0) + totalResistance[resistanceKey]!;
  });
  
  // Ensure HP and MP don't exceed new max values
  stats.hp = Math.min(stats.hp, stats.maxHp);
  stats.mp = Math.min(stats.mp, stats.maxMp);
  
  return stats;
};

export const getHighestElement = (elements: Partial<Elements> | null | undefined): { element: ElementType | null, value: number } => {
  let highestValue = 0;
  let highestElement: ElementType | null = null;
  
  if (!elements) {
    return { element: null, value: 0 };
  }
  
  Object.entries(elements).forEach(([element, value]) => {
    if (value && value > highestValue) {
      highestValue = value;
      highestElement = element as ElementType;
    }
  });
  
  return { element: highestElement, value: highestValue };
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
