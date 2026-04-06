import { useCallback } from 'react';
import { GameState, Equipment, ShopItem } from '../types/game';
import { generateShopItems } from '../utils/shop';
import { generateEquipment } from '../utils/equipment';

export const useShopInventory = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  addBattleLogEntry: (entry: { message: string; type: 'player' | 'enemy' | 'system'; timestamp: number }) => void,
  saveGame: (state: GameState) => void
): {
  buyItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: "weapon" | "armor" | "accessory" | "helmet" | "boots" | "ring" | "necklace") => void;
  refreshShop: () => void;
  getAllEquipment: () => Equipment[];
  getInventoryEquipment: () => Equipment[];
  getAvailableShopItems: () => ShopItem[];
} => {
  const getAllEquipment = useCallback(() => {
    const allEquipment: Equipment[] = [];
    
    // Get equipment from player inventory (already contains full equipment objects)
    gameState.player.inventory.forEach(equipment => {
      allEquipment.push(equipment);
    });
    
    // Add shop items for display purposes (not in inventory)
    gameState.shopItems.forEach(shopItem => {
      if (!allEquipment.find(eq => eq.id === shopItem.id)) {
        // Convert shop item to equipment format - need to determine type
        // For now, default to 'weapon' type
        const equipmentData = generateEquipment(shopItem.id, 'weapon', gameState.player.level);
        allEquipment.push(equipmentData);
      }
    });
    
    return allEquipment;
  }, [gameState.player.inventory, gameState.shopItems, gameState.player.level]);

  // Get only inventory equipment (for inventory display)
  const getInventoryEquipment = useCallback(() => {
    return gameState.player.inventory;
  }, [gameState.player.inventory]);

  // Get available shop items (exclude items already in inventory)
  const getAvailableShopItems = useCallback(() => {
    return gameState.shopItems.filter(shopItem => 
      !gameState.player.inventory.find(equipment => equipment.id === shopItem.id)
    );
  }, [gameState.shopItems, gameState.player.inventory]);

  // Buy item from shop
  const buyItem = useCallback((itemId: string) => {
    const shopItem = gameState.shopItems.find(item => item.id === itemId);
    if (!shopItem) {
      addBattleLogEntry({
        message: 'Item not found in shop!',
        type: 'system',
        timestamp: Date.now()
      });
      return;
    }

    if (gameState.player.coin < shopItem.price) {
      addBattleLogEntry({
        message: 'Not enough coins!',
        type: 'system',
        timestamp: Date.now()
      });
      return;
    }

    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player, coin: prev.player.coin - shopItem.price };
      
      // Generate equipment and add to inventory
      const purchasedEquipment = generateEquipment(shopItem.id, 'weapon', newPlayer.level);
      newPlayer.inventory = [...newPlayer.inventory, purchasedEquipment];

      const newState = {
        ...prev,
        player: newPlayer
      };
      
      // Explicit save after purchase
      saveGame(newState);
      return newState;
    });
  }, [gameState.shopItems, gameState.player.coin, setGameState, addBattleLogEntry, saveGame]);

  // Sell item from inventory
  const sellItem = useCallback((itemId: string) => {
    const equipment = gameState.player.inventory.find(eq => eq.id === itemId);
    if (!equipment) {
      addBattleLogEntry({
        message: 'Item not found in inventory!',
        type: 'system',
        timestamp: Date.now()
      });
      return;
    }

    // Check if item is equipped
    const isEquipped = Object.values(gameState.player.equippedItems).includes(itemId);
    if (isEquipped) {
      addBattleLogEntry({
        message: 'Cannot sell equipped item!',
        type: 'system',
        timestamp: Date.now()
      });
      return;
    }

    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player, coin: prev.player.coin + equipment.sellPrice };
      
      // Remove from inventory
      newPlayer.inventory = newPlayer.inventory.filter(eq => eq.id !== itemId);

      const newState = {
        ...prev,
        player: newPlayer
      };
      
      // Explicit save after sale
      saveGame(newState);
      return newState;
    });
  }, [gameState.player.inventory, gameState.player.equippedItems, setGameState, addBattleLogEntry, saveGame]);

  // Equip item
  const equipItem = useCallback((itemId: string) => {
    const equipment = gameState.player.inventory.find(eq => eq.id === itemId);
    if (!equipment) {
      addBattleLogEntry({
        message: 'Item not found in inventory!',
        type: 'system',
        timestamp: Date.now()
      });
      return;
    }

    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player };
      
      // Unequip current item in the same slot if exists
      const currentEquippedId = prev.player.equippedItems[equipment.type];
      if (currentEquippedId) {
        // Mark the old item as unequipped
        newPlayer.inventory = newPlayer.inventory.map(eq => 
          eq.id === currentEquippedId ? { ...eq, equipped: false } : eq
        );
      }
      
      // Equip new item
      newPlayer.equippedItems = {
        ...prev.player.equippedItems,
        [equipment.type]: itemId
      };
      
      // Mark the new item as equipped
      newPlayer.inventory = newPlayer.inventory.map(eq => 
        eq.id === itemId ? { ...eq, equipped: true } : eq
      );

      const newState = {
        ...prev,
        player: newPlayer
      };
      
      // Explicit save after equipping
      saveGame(newState);
      return newState;
    });
  }, [gameState.player.inventory, gameState.player.equippedItems, setGameState, addBattleLogEntry, saveGame]);

  // Unequip item
  const unequipItem = useCallback((slot: "weapon" | "armor" | "accessory" | "helmet" | "boots" | "ring" | "necklace") => {
    const equippedItemId = gameState.player.equippedItems[slot];
    if (!equippedItemId) {
      addBattleLogEntry({
        message: 'No item equipped in this slot!',
        type: 'system',
        timestamp: Date.now()
      });
      return;
    }

    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player };
      
      // Remove from equipped items
      const { [slot]: removedItem, ...restEquippedItems } = prev.player.equippedItems;
      newPlayer.equippedItems = restEquippedItems;
      
      // Mark the item as unequipped in inventory
      newPlayer.inventory = newPlayer.inventory.map(eq => 
        eq.id === equippedItemId ? { ...eq, equipped: false } : eq
      );

      const newState = {
        ...prev,
        player: newPlayer
      };
      
      // Explicit save after unequipping
      saveGame(newState);
      return newState;
    });
  }, [gameState.player.equippedItems, gameState.player.inventory, setGameState, addBattleLogEntry, saveGame]);

  // Refresh shop (generate new items)
  const refreshShop = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      shopItems: generateShopItems(prev.player.level)
    }));
  }, [setGameState]);

  return {
    buyItem,
    sellItem,
    equipItem,
    unequipItem,
    refreshShop,
    getAllEquipment,
    getInventoryEquipment,
    getAvailableShopItems
  };
};
