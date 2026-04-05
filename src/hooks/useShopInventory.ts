import { useCallback } from 'react';
import { BattleLogEntry, GameState } from '../types/game';
import { equipItem } from '../utils/equipment';

export const useShopInventory = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  addBattleLogEntry: (entry: BattleLogEntry) => void
) => {
  const buyItem = useCallback((itemId: string) => {
    const item = gameState.shopItems.find((shopItem: any) => shopItem.id === itemId);
    if (!item || gameState.player.coin < item.price) return;

    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player, coin: prev.player.coin - item.price };
      
      // Add equipment to inventory
      newPlayer.inventory = [...newPlayer.inventory, itemId];

      return {
        ...prev,
        player: newPlayer
      };
    });

    addBattleLogEntry({
      message: `Purchased ${item.name} for ${item.price} 🪙!`,
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.shopItems, gameState.player.coin, setGameState, addBattleLogEntry]);

  const sellItem = useCallback((itemId: string) => {
    if (!gameState.player.inventory.includes(itemId)) return;

    const item = gameState.shopItems.find((shopItem: any) => shopItem.id === itemId);
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
      message: `Sold item for ${sellPrice} 🪙!`,
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.player.inventory, gameState.shopItems, setGameState, addBattleLogEntry]);

  const useItem = useCallback((itemId: string) => {
    if (!gameState.player.inventory.includes(itemId)) return;

    // Try to equip the item
    const newPlayer = equipItem(gameState.player, itemId);
    
    // Check if the item was actually equipped
    if (newPlayer !== gameState.player) {
      // Item was equipped successfully
      const itemName = itemId === 'sword1' ? '铁剑' :
                      itemId === 'sword2' ? '钢剑' :
                      itemId === 'staff1' ? '木杖' :
                      itemId === 'staff2' ? '水晶杖' :
                      itemId === 'armor1' ? '皮甲' :
                      itemId === 'armor2' ? '铁甲' :
                      itemId === 'armor3' ? '道袍' :
                      itemId === 'armor4' ? '法袍' : itemId;
      
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
    useItem
  };
};
