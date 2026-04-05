import { ShopItem, Equipment } from '../types/game';

export const generateShopItems = (): ShopItem[] => {
  return [
    // Weapons - 法剑
    {
      id: 'sword1',
      name: '铁剑',
      description: '凡铁打造的剑，蕴含微弱灵气',
      price: 100,
      type: 'equipment',
      effect: '+5 攻击力'
    },
    {
      id: 'sword2',
      name: '钢剑',
      description: '百炼钢剑，锋利无比',
      price: 250,
      type: 'equipment',
      effect: '+10 攻击力'
    },
    {
      id: 'staff1',
      name: '木杖',
      description: '千年灵木所制，可引导灵力',
      price: 80,
      type: 'equipment',
      effect: '+5 法术攻击'
    },
    {
      id: 'staff2',
      name: '水晶杖',
      description: '蕴含水精之力的法杖',
      price: 200,
      type: 'equipment',
      effect: '+12 法术攻击'
    },
    
    // Armor - 护甲/道袍
    {
      id: 'armor1',
      name: '皮甲',
      description: '兽皮制成的轻甲，可抵御寻常攻击',
      price: 120,
      type: 'equipment',
      effect: '+3 防御力'
    },
    {
      id: 'armor2',
      name: '铁甲',
      description: '玄铁打造的重甲，防御力强',
      price: 300,
      type: 'equipment',
      effect: '+6 防御力'
    },
    {
      id: 'armor3',
      name: '道袍',
      description: '普通道袍，可抵御法术攻击',
      price: 150,
      type: 'equipment',
      effect: '+4 抗法'
    },
    {
      id: 'armor4',
      name: '法袍',
      description: '蕴含灵力的道袍，抗法能力出众',
      price: 350,
      type: 'equipment',
      effect: '+8 抗法'
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
