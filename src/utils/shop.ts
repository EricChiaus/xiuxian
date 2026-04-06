import { ShopItem, Equipment, getElementName, getRarityName, getEquipmentTypeName } from '../types/game';
import { generateRandomEquipment } from './equipment';

export const generateShopItems = (playerLevel: number): Equipment[] => {
  const items: Equipment[] = [];
  const itemCount = 6 + Math.floor(Math.random() * 3); // 6-8 items
  
  for (let i = 0; i < itemCount; i++) {
    items.push(generateRandomEquipment(playerLevel));
  }
  
  return items;
};
