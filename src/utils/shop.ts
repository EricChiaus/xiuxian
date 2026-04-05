import { ShopItem, Equipment } from '../types/game';
import { generateRandomEquipment } from './equipment';

export const generateShopItems = (playerLevel: number): ShopItem[] => {
  const items: Equipment[] = [];
  const itemCount = 6 + Math.floor(Math.random() * 3); // 6-8 items
  
  for (let i = 0; i < itemCount; i++) {
    items.push(generateRandomEquipment(playerLevel));
  }
  
  return items.map(item => ({
    id: item.id,
    name: item.name,
    description: `${item.name} (Level ${item.level})`,
    price: item.price,
    type: 'equipment',
    effect: `Power: ${item.bonus.pa || item.bonus.ma || 0}`
  }));
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
      powers: {},
      powerResistance: {},
      price: 100,
      sellPrice: 50
    },
    {
      id: 'sword2',
      name: 'Steel Sword',
      type: 'weapon',
      level: 2,
      bonus: { pa: 10 },
      powers: {},
      powerResistance: {},
      price: 250,
      sellPrice: 125
    },
    {
      id: 'staff1',
      name: 'Wooden Staff',
      type: 'weapon',
      level: 1,
      bonus: { ma: 5 },
      powers: {},
      powerResistance: {},
      price: 80,
      sellPrice: 40
    },
    {
      id: 'staff2',
      name: 'Crystal Staff',
      type: 'weapon',
      level: 2,
      bonus: { ma: 12 },
      powers: {},
      powerResistance: {},
      price: 200,
      sellPrice: 100
    },
    {
      id: 'armor1',
      name: 'Leather Armor',
      type: 'armor',
      level: 1,
      bonus: { pd: 3 },
      powers: {},
      powerResistance: {},
      price: 120,
      sellPrice: 60
    },
    {
      id: 'armor2',
      name: 'Iron Armor',
      type: 'armor',
      level: 2,
      bonus: { pd: 6 },
      powers: {},
      powerResistance: {},
      price: 300,
      sellPrice: 150
    },
    {
      id: 'armor3',
      name: 'Robe',
      type: 'armor',
      level: 1,
      bonus: { md: 4 },
      powers: {},
      powerResistance: {},
      price: 150,
      sellPrice: 75
    },
    {
      id: 'armor4',
      name: 'Enchanted Robe',
      type: 'armor',
      level: 2,
      bonus: { md: 8 },
      powers: {},
      powerResistance: {},
      price: 350,
      sellPrice: 175
    }
  ];
};
