import { ShopItem, Equipment } from '../types/game';
import { generateRandomEquipment } from './equipment';

export const generateShopItems = (playerLevel: number): ShopItem[] => {
  const items: Equipment[] = [];
  const itemCount = 6 + Math.floor(Math.random() * 3); // 6-8 items
  
  for (let i = 0; i < itemCount; i++) {
    items.push(generateRandomEquipment(playerLevel));
  }
  
  return items.map(item => {
    // Get the highest power for display
    const highestPower = Object.entries(item.Elements)
      .filter(([_, value]) => value > 0)
      .sort(([_, a], [__, b]) => b - a)[0];
    
    return {
      id: item.id,
      name: item.name,
      description: `${item.name} (Level ${item.level})${highestPower ? ` - ${highestPower[0]} ${highestPower[1]}` : ''}`,
      price: item.price,
      type: 'equipment',
      effect: `Power: ${item.bonus.pa || item.bonus.ma || 0}${highestPower ? ` (${highestPower[0]} ${highestPower[1]})` : ''}`
    };
  });
};

// Legacy function for backward compatibility
export const generateEquipment = (): Equipment[] => {
  return [
    {
      id: 'sword1',
      name: 'Iron Sword',
      type: 'weapon',
      level: 1,
      bonus: { pa: 5 },
      elements: {},
      elementResistance: {},
      price: 100,
      sellPrice: 50
    },
    {
      id: 'sword2',
      name: 'Steel Sword',
      type: 'weapon',
      level: 2,
      bonus: { pa: 10 },
      elements: {},
      elementResistance: {},
      price: 250,
      sellPrice: 125
    },
    {
      id: 'staff1',
      name: 'Wooden Staff',
      type: 'weapon',
      level: 1,
      bonus: { ma: 5 },
      elements: {},
      elementResistance: {},
      price: 80,
      sellPrice: 40
    },
    {
      id: 'staff2',
      name: 'Crystal Staff',
      type: 'weapon',
      level: 2,
      bonus: { ma: 12 },
      elements: {},
      elementResistance: {},
      price: 200,
      sellPrice: 100
    },
    {
      id: 'armor1',
      name: 'Leather Armor',
      type: 'armor',
      level: 1,
      bonus: { pd: 3 },
      elements: {},
      elementResistance: {},
      price: 120,
      sellPrice: 60
    },
    {
      id: 'armor2',
      name: 'Iron Armor',
      type: 'armor',
      level: 2,
      bonus: { pd: 6 },
      elements: {},
      elementResistance: {},
      price: 300,
      sellPrice: 150
    },
    {
      id: 'armor3',
      name: 'Robe',
      type: 'armor',
      level: 1,
      bonus: { md: 4 },
      elements: {},
      elementResistance: {},
      price: 150,
      sellPrice: 75
    },
    {
      id: 'armor4',
      name: 'Enchanted Robe',
      type: 'armor',
      level: 2,
      bonus: { md: 8 },
      elements: {},
      elementResistance: {},
      price: 350,
      sellPrice: 175
    }
  ];
};
