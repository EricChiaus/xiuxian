import { useCallback } from 'react';
import { BattleLogEntry, GameState } from '../types/game';
import { equipItem } from '../utils/equipment';
import { generateShopItems } from '../utils/shop';

export const useShopInventory = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  addBattleLogEntry: (entry: BattleLogEntry) => void
) => {
  const refreshShop = useCallback(() => {
    const newShopItems = generateShopItems(gameState.player.level);
    
    setGameState(prev => ({
      ...prev,
      shopItems: newShopItems
    }));
    
    addBattleLogEntry({
      message: 'Shop inventory refreshed!',
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.player.level, setGameState, addBattleLogEntry]);

  const buyItem = useCallback((itemId: string) => {
    const shopItem = gameState.shopItems.find(item => item.id === itemId);
    if (!shopItem || gameState.player.coin < shopItem.price) return;

    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player, coin: prev.player.coin - shopItem.price };
      
      // Add equipment to inventory
      newPlayer.inventory = [...newPlayer.inventory, itemId];

      return {
        ...prev,
        player: newPlayer
      };
    });

    addBattleLogEntry({
      message: `Purchased ${shopItem.name} for ${shopItem.price} 🪙!`,
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.shopItems, gameState.player.coin, setGameState, addBattleLogEntry]);

  const sellItem = useCallback((itemId: string) => {
    if (!gameState.player.inventory.includes(itemId)) return;

    const item = gameState.shopItems.find(item => item.id === itemId);
    if (!item) return;

    const sellPrice = Math.floor(item.price / 2);
    
    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player, coin: prev.player.coin + sellPrice };
      newPlayer.inventory = newPlayer.inventory.filter((id: string) => id !== itemId);

      // Remove from equipped items if selling equipped item
      if (newPlayer.equippedItems.weapon === itemId) {
        delete newPlayer.equippedItems.weapon;
      }
      if (newPlayer.equippedItems.armor === itemId) {
        delete newPlayer.equippedItems.armor;
      }

      return {
        ...prev,
        player: newPlayer
      };
    });

    addBattleLogEntry({
      message: `Sold ${item.name} for ${sellPrice} 🪙!`,
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.player.inventory, gameState.shopItems, setGameState, addBattleLogEntry]);

  const useItem = useCallback((itemId: string) => {
    if (!gameState.player.inventory.includes(itemId)) return;

    // Try to equip item
    const newPlayer = equipItem(gameState.player, itemId);
    
    // Check if item was actually equipped
    if (newPlayer !== gameState.player) {
      // Item was equipped successfully
      const item = gameState.shopItems.find(shopItem => shopItem.id === itemId);
      const itemName = item?.name || itemId;
      
      addBattleLogEntry({
        message: `装备了 ${itemName}！`,
        type: 'system',
        timestamp: Date.now()
      });
      
      setGameState((prev: GameState) => ({
        ...prev,
        player: newPlayer
      }));
    }
  }, [gameState.player, addBattleLogEntry, setGameState]);

  return {
    buyItem,
    sellItem,
    useItem,
    refreshShop
  };
};
