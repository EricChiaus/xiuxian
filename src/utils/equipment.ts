import { Character, Equipment, ElementType, Elements, ElementResistance, getElementMultiplier, getElementName, getRarityName } from '../types/game';

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

export const generateEquipment = (id: string, type: Equipment['type'], level: number, rarity?: Equipment['rarity']): Equipment => {
  // Generate rarity if not provided
  const rarityRoll = Math.random();
  const finalRarity = rarity || (
    rarityRoll < 0.5 ? 'common' :
    rarityRoll < 0.8 ? 'uncommon' :
    rarityRoll < 0.95 ? 'rare' :
    rarityRoll < 0.99 ? 'epic' : 'legendary'
  );

  const baseStats = getBaseStats(type);
  const rarityMultiplier = {
    common: 1.0,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2.0,
    legendary: 3.0
  }[finalRarity];

  const levelMultiplier = 1 + (level - 1) * 0.5; // 50% increase per level
  const totalMultiplier = levelMultiplier * rarityMultiplier;
  const basePrice = getBasePrice(type);

  // Generate elements and resistance (rarer items get more elements)
  const primaryElement = generateRandomElement();
  const secondaryElement = (type === 'accessory' || finalRarity === 'legendary' || finalRarity === 'epic') && Math.random() < 0.4 ? generateRandomElement() : null;

  const elements: Partial<Elements> = {};

  if (primaryElement) {
    elements[primaryElement] = Math.floor(generateElementValue(level) * rarityMultiplier);
  }

  if (secondaryElement && secondaryElement !== primaryElement) {
    elements[secondaryElement] = Math.floor(generateElementValue(level) * rarityMultiplier);
  }

  const price = Math.floor(basePrice * levelMultiplier * rarityMultiplier);

  return {
    id,
    name: getEquipmentName(type, level, primaryElement, finalRarity),
    type,
    rarity: finalRarity,
    level,
    bonus: {
      pa: baseStats.pa ? Math.floor(baseStats.pa * totalMultiplier) : undefined,
      ma: baseStats.ma ? Math.floor(baseStats.ma * totalMultiplier) : undefined,
      pd: baseStats.pd ? Math.floor(baseStats.pd * totalMultiplier) : undefined,
      md: baseStats.md ? Math.floor(baseStats.md * totalMultiplier) : undefined,
      maxHp: baseStats.maxHp ? Math.floor(baseStats.maxHp * totalMultiplier) : undefined,
      maxMp: baseStats.maxMp ? Math.floor(baseStats.maxMp * totalMultiplier) : undefined
    },
    elements,
    price,
    sellPrice: Math.floor(price * 0.5)
  };
};

const getBaseStats = (type: Equipment['type']): ItemStats => {
  switch (type) {
    case 'weapon':
      return { pa: 8, ma: 6 };
    case 'armor':
      return { pd: 5, md: 4, maxHp: 20, maxMp: 10 };
    case 'helmet':
      return { pd: 3, md: 2, maxHp: 15, maxMp: 5 };
    case 'boots':
      return { pd: 2, md: 2, maxHp: 10, maxMp: 5 };
    case 'ring':
      return { pa: 2, ma: 4, maxMp: 8 };
    case 'necklace':
      return { ma: 5, md: 3, maxMp: 12 };
    case 'accessory':
      return { pa: 3, ma: 3, pd: 2, md: 2, maxHp: 10, maxMp: 5 };
    default:
      return {};
  }
};

const getBasePrice = (type: Equipment['type']): number => {
  switch (type) {
    case 'weapon': return 50;
    case 'armor': return 40;
    case 'helmet': return 25;
    case 'boots': return 20;
    case 'ring': return 35;
    case 'necklace': return 45;
    case 'accessory': return 30;
    default: return 20;
  }
};

const getEquipmentName = (type: Equipment['type'], level: number, element?: ElementType | null, rarity?: Equipment['rarity']): string => {
  const rarityPrefix = rarity ? getRarityName(rarity) : '';
  const elementPrefix = element ? getElementName(element) : '';
  
  const typeName = {
    weapon: ['铁剑', '钢剑', '灵剑', '仙剑', '神剑'],
    armor: ['布甲', '皮甲', '铁甲', '仙袍', '神袍'],
    helmet: ['布帽', '皮帽', '铁盔', '仙冠', '神冠'],
    boots: ['布靴', '皮靴', '铁靴', '仙履', '神履'],
    ring: ['铁戒', '银戒', '金戒', '仙戒', '神戒'],
    necklace: ['铁链', '银链', '金链', '仙链', '神链'],
    accessory: ['木符', '玉符', '灵符', '仙符', '神符']
  };
  
  return rarityPrefix + elementPrefix + typeName[type][level - 1];
};

export const generateRandomEquipment = (playerLevel: number): Equipment => {
  const types: Array<Equipment['type']> = ['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace', 'accessory'];
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

export const calculateAllEquipment = (character: Character): Character => {
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

  character.inventory.forEach(equipment => {
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

    // Calculate resistance (half of element values)
    Object.keys(equipment.elements).forEach(element => {
      const elementKey = element as keyof Elements;
      const elementValue = equipment.elements[elementKey];
      if (elementValue) {
        totalResistance[elementKey] = (totalResistance[elementKey] || 0) + Math.floor(elementValue / 2);
      }
    });
  });

  // Apply bonuses to base stats
  const stats: Character = {
    pa: (baseCharacter.pa || 0) + (totalBonus.pa || 0),
    ma: (baseCharacter.ma || 0) + (totalBonus.ma || 0),
    pd: (baseCharacter.pd || 0) + (totalBonus.pd || 0),
    md: (baseCharacter.md || 0) + (totalBonus.md || 0),
    maxHp: (baseCharacter.maxHp || 0) + (totalBonus.maxHp || 0),
    maxMp: (baseCharacter.maxMp || 0) + (totalBonus.maxMp || 0),
    hp: (baseCharacter.hp || 0),
    mp: (baseCharacter.mp || 0),
    level: character.level,
    exp: character.exp,
    expToNext: character.expToNext,
    coin: character.coin,
    inventory: character.inventory,
    avatar: character.avatar,
    elements: { ...baseCharacter.elements },
    elementResistance: { ...baseCharacter.elementResistance }
  };

  // Apply element bonuses to base elements
  Object.keys(totalElements).forEach(element => {
    const elementKey = element as keyof Elements;
    stats.elements[elementKey] = (stats.elements[elementKey] || 0) + totalElements[elementKey]!;
  });

  // Apply resistance bonuses to base resistance
  Object.keys(totalResistance).forEach(resistance => {
    const resistanceKey = resistance as keyof ElementResistance;
    stats.elementResistance[resistanceKey] = (stats.elementResistance[resistanceKey] || 0) + totalResistance[resistanceKey]!;
  });

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

export const getAllElementDamage = (attackerElements: Partial<Elements> | null | undefined, targetResistance: Partial<ElementResistance> | null | undefined, targetElements: Partial<Elements> | null | undefined): { totalDamage: number; elementDamages: Array<{ element: ElementType; damage: number; resisted: boolean }> } => {
  const elementDamages: Array<{ element: ElementType; damage: number; resisted: boolean }> = [];
  let totalDamage = 0;

  if (!attackerElements || !targetResistance) {
    return { totalDamage: 0, elementDamages: [] };
  }

  Object.entries(attackerElements).forEach(([element, value]) => {
    if (!value || value <= 0) return;

    const elementType = element as ElementType;
    let damage = value;
    let resisted = false;

    // Apply element resistance
    const resistance = targetResistance[elementType] || 0;
    const resistanceReduction = Math.min(0.5, resistance * 0.05); // Max 50% reduction
    
    if (resistanceReduction > 0) {
      damage = Math.floor(damage * (1 - resistanceReduction));
      resisted = true;
    }

    // Apply element interaction multiplier if target has elements
    if (targetElements) {
      const targetHighestElement = getHighestElement(targetElements);
      if (targetHighestElement.element) {
        const multiplier = getElementMultiplier(elementType, targetHighestElement.element);
        damage = Math.floor(damage * multiplier);
      }
    }

    // Ensure integer damage and minimum 1 damage for each element
    damage = Math.max(1, Math.floor(damage));

    elementDamages.push({
      element: elementType,
      damage,
      resisted
    });

    totalDamage += damage;
  });

  return { totalDamage, elementDamages };
};

export const equipItem = (character: Character, itemId: string): Character => {
  // Find the equipment in inventory
  const equipment = character.inventory.find(eq => eq.id === itemId);
  
  if (!equipment) {
    return character; // Item not in inventory
  }
  
  let newCharacter = { ...character };
  
  // If there's already an item equipped in this slot, mark it as unequipped
  const currentEquippedId = character.equippedItems[equipment.type];
  if (currentEquippedId) {
    newCharacter.inventory = newCharacter.inventory.map(eq => 
      eq.id === currentEquippedId ? { ...eq, equipped: false } : eq
    );
  }
  
  // Equip new item
  newCharacter.equippedItems = {
    ...character.equippedItems,
    [equipment.type]: itemId
  };
  
  // Mark the new item as equipped
  newCharacter.inventory = newCharacter.inventory.map(eq => 
    eq.id === itemId ? { ...eq, equipped: true } : eq
  );
  
  return newCharacter;
};

export const unequipItem = (character: Character, slot: keyof Character['equippedItems']): Character => {
  const equippedItemId = character.equippedItems[slot];
  
  if (!equippedItemId) {
    return character; // Nothing equipped in this slot
  }
  
  let newCharacter = { ...character };
  
  // Mark the item as unequipped in inventory
  newCharacter.inventory = newCharacter.inventory.map(eq => 
    eq.id === equippedItemId ? { ...eq, equipped: false } : eq
  );
  
  // Remove from equipped items
  const { [slot]: _removedItem, ...restEquippedItems } = character.equippedItems;
  newCharacter.equippedItems = restEquippedItems;
  
  return newCharacter;
};
