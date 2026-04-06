import { ShopItem, Equipment, getElementName, getRarityName, getEquipmentTypeName } from '../types/game';
import { generateRandomEquipment } from './equipment';

export const generateShopItems = (playerLevel: number): ShopItem[] => {
  const items: Equipment[] = [];
  const itemCount = 6 + Math.floor(Math.random() * 3); // 6-8 items
  
  for (let i = 0; i < itemCount; i++) {
    items.push(generateRandomEquipment(playerLevel));
  }
  
  return items.map(item => {
    // Get all elements for display
    const elements = Object.entries(item.elements)
      .filter(([_, value]) => value > 0)
      .map(([element, value]) => `${getElementName(element as any)} ${Math.floor(value)}`)
      .join(', ');
    
    // Build stats description
    const stats = [];
    if (item.bonus.pa) stats.push(`物攻 +${item.bonus.pa}`);
    if (item.bonus.ma) stats.push(`魔攻 +${item.bonus.ma}`);
    if (item.bonus.pd) stats.push(`物防 +${item.bonus.pd}`);
    if (item.bonus.md) stats.push(`魔防 +${item.bonus.md}`);
    if (item.bonus.maxHp) stats.push(`生命 +${item.bonus.maxHp}`);
    if (item.bonus.maxMp) stats.push(`法力 +${item.bonus.maxMp}`);
    
    const statsText = stats.length > 0 ? stats.join(', ') : '无属性加成';
    const elementsText = elements || '无元素';
    const rarityText = getRarityName(item.rarity);
    const typeText = getEquipmentTypeName(item.type);
    
    // Build complete description with stats and elements
    const descriptionParts = [
      `${item.name} (${typeText} - 等级 ${item.level})`,
      rarityText,
      statsText,
      elementsText
    ];
    
    return {
      id: item.id,
      name: item.name,
      description: descriptionParts.filter(part => part && part !== '无元素' && part !== '无属性加成').join(' | '),
      price: item.price,
      type: 'equipment',
      effect: '' // ShopItem interface requires this but we don't use it
    };
  });
};
