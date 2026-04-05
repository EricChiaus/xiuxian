import { useCallback } from 'react';
import { Character, ShopItem } from '../types/game';
import { addBattleLogEntry } from './useGame';

export const useShopLogic = (player: Character, shopItems: ShopItem[], onAddBattleLogEntry: (entry: any) => void) => {
  const buyItem = useCallback((itemId: string) => {
    const item = shopItems.find(shopItem => shopItem.id === itemId);
    if (!item || player.coin < item.price) return;

    const newPlayer = { ...player, coin: player.coin - item.price };
    
    // Add equipment to inventory
    newPlayer.inventory = [...newPlayer.inventory, itemId];

    onAddBattleLogEntry({
      message: `Purchased ${item.name} for ${item.price} 🪙!`,
      type: 'system',
      timestamp: Date.now()
    });

    return newPlayer;
  }, [shopItems, player.coin]);

  const sellItem = useCallback((itemId: string) => {
    if (!player.inventory.includes(itemId)) return;

    const item = shopItems.find(shopItem => shopItem.id === itemId);
    if (!item) return;

    const newPlayer = { 
      ...player, 
      coin: player.coin + Math.floor(item.price / 2), // Sell for half price
      inventory: player.inventory.filter(id => id !== itemId)
    };

    onAddBattleLogEntry({
      message: `Sold item for ${Math.floor(item.price / 2)} 🪙!`,
      type: 'system',
      timestamp: Date.now()
    });

    return newPlayer;
  }, [player.inventory, shopItems]);

  return { buyItem, sellItem };
};
