import { ShopItem, Equipment } from '../types/game';

export const generateShopItems = (): ShopItem[] => {
  return [
    // Weapons
    {
      id: 'sword1',
      name: 'Iron Sword',
      description: 'A basic sword with +5 PA',
      price: 100,
      type: 'equipment',
      effect: '+5 Physical Attack'
    },
    {
      id: 'sword2',
      name: 'Steel Sword',
      description: 'A sturdy sword with +10 PA',
      price: 250,
      type: 'equipment',
      effect: '+10 Physical Attack'
    },
    {
      id: 'staff1',
      name: 'Wooden Staff',
      description: 'A basic staff with +5 MA',
      price: 80,
      type: 'equipment',
      effect: '+5 Magic Attack'
    },
    {
      id: 'staff2',
      name: 'Crystal Staff',
      description: 'A powerful staff with +12 MA',
      price: 200,
      type: 'equipment',
      effect: '+12 Magic Attack'
    },
    
    // Armor
    {
      id: 'armor1',
      name: 'Leather Armor',
      description: 'Light armor with +3 PD',
      price: 120,
      type: 'equipment',
      effect: '+3 Physical Defense'
    },
    {
      id: 'armor2',
      name: 'Iron Armor',
      description: 'Heavy armor with +6 PD',
      price: 300,
      type: 'equipment',
      effect: '+6 Physical Defense'
    },
    {
      id: 'armor3',
      name: 'Robe',
      description: 'Magic robe with +4 MD',
      price: 150,
      type: 'equipment',
      effect: '+4 Magic Defense'
    },
    {
      id: 'armor4',
      name: 'Enchanted Robe',
      description: 'Powerful robe with +8 MD',
      price: 350,
      type: 'equipment',
      effect: '+8 Magic Defense'
    }
  ];
};

export const generateEquipment = (): Equipment[] => {
  return [
    {
      id: 'sword1',
      name: 'Iron Sword',
      type: 'weapon',
      bonus: { pa: 5 },
      price: 100,
      sellPrice: 50
    },
    {
      id: 'sword2',
      name: 'Steel Sword',
      type: 'weapon',
      bonus: { pa: 10 },
      price: 250,
      sellPrice: 125
    },
    {
      id: 'staff1',
      name: 'Wooden Staff',
      type: 'weapon',
      bonus: { ma: 5 },
      price: 80,
      sellPrice: 40
    },
    {
      id: 'staff2',
      name: 'Crystal Staff',
      type: 'weapon',
      bonus: { ma: 12 },
      price: 200,
      sellPrice: 100
    },
    {
      id: 'armor1',
      name: 'Leather Armor',
      type: 'armor',
      bonus: { pd: 3 },
      price: 120,
      sellPrice: 60
    },
    {
      id: 'armor2',
      name: 'Iron Armor',
      type: 'armor',
      bonus: { pd: 6 },
      price: 300,
      sellPrice: 150
    },
    {
      id: 'armor3',
      name: 'Robe',
      type: 'armor',
      bonus: { md: 4 },
      price: 150,
      sellPrice: 75
    },
    {
      id: 'armor4',
      name: 'Enchanted Robe',
      type: 'armor',
      bonus: { md: 8 },
      price: 350,
      sellPrice: 175
    }
  ];
};
