import { useCallback } from 'react';
import { GameState, Equipment, ShopItem, Elements, ElementResistance } from '../types/game';
import { generateShopItems } from '../utils/shop';
import { generateEquipment, generateRandomEquipment } from '../utils/equipment';
import { calculateStats } from '../utils/character';

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
      // We need to regenerate the equipment since shop only stores ShopItem display data
      const purchasedEquipment = generateRandomEquipment(newPlayer.level);
      // But use the shop item's ID, name, and price to maintain consistency
      purchasedEquipment.id = shopItem.id;
      purchasedEquipment.name = shopItem.name;
      purchasedEquipment.price = shopItem.price;
      purchasedEquipment.sellPrice = Math.floor(shopItem.price / 2);
      
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
    const isEquipped = gameState.player.inventory.some(eq => eq.id === itemId && eq.equipped);
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
  }, [gameState.player.inventory, setGameState, addBattleLogEntry, saveGame]);

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
      const currentlyEquipped = prev.player.inventory.find(eq => eq.equipped && eq.type === equipment.type);
      if (currentlyEquipped) {
        // Mark the old item as unequipped
        newPlayer.inventory = newPlayer.inventory.map(eq => 
          eq.id === currentlyEquipped.id ? { ...eq, equipped: false } : eq
        );
      }
      
      // Equip the new item
      newPlayer.inventory = newPlayer.inventory.map(eq => 
        eq.id === itemId ? { ...eq, equipped: true } : eq
      );
      
      // Recalculate stats based on equipped items
      const equippedItems = newPlayer.inventory.filter(eq => eq.equipped);
      
      // Reset stats to base values
      const baseCharacter = calculateStats({
        ...newPlayer,
        inventory: [], // Remove equipment for base calculation
        elements: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 },
        elementResistance: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 }
      });
      
      // Apply equipment bonuses
      newPlayer.pa = baseCharacter.pa;
      newPlayer.ma = baseCharacter.ma;
      newPlayer.pd = baseCharacter.pd;
      newPlayer.md = baseCharacter.md;
      newPlayer.maxHp = baseCharacter.maxHp;
      newPlayer.maxMp = baseCharacter.maxMp;
      newPlayer.elements = { ...baseCharacter.elements };
      newPlayer.elementResistance = { ...baseCharacter.elementResistance };
      
      equippedItems.forEach(eq => {
        if (eq.bonus.pa) newPlayer.pa += eq.bonus.pa;
        if (eq.bonus.ma) newPlayer.ma += eq.bonus.ma;
        if (eq.bonus.pd) newPlayer.pd += eq.bonus.pd;
        if (eq.bonus.md) newPlayer.md += eq.bonus.md;
        if (eq.bonus.maxHp) newPlayer.maxHp += eq.bonus.maxHp;
        if (eq.bonus.maxMp) newPlayer.maxMp += eq.bonus.maxMp;
        
        // Add elemental bonuses
        if (eq.elements) {
          Object.entries(eq.elements).forEach(([element, value]) => {
            if (value && element in newPlayer.elements) {
              newPlayer.elements[element as keyof Elements] += value;
            }
          });
        }
        
        // Add elemental resistance (half of element values)
        if (eq.elements) {
          Object.entries(eq.elements).forEach(([element, value]) => {
            if (value && element in newPlayer.elementResistance) {
              const resistanceValue = Math.floor(value / 2);
              newPlayer.elementResistance[element as keyof ElementResistance] += resistanceValue;
            }
          });
        }
      });
      
      // Ensure current HP/MP don't exceed new max values, but also scale up if max increased
      const hpRatio = prev.player.hp / prev.player.maxHp;
      const mpRatio = prev.player.mp / prev.player.maxMp;
      
      // If max HP increased, scale current HP proportionally, otherwise cap at new max
      if (newPlayer.maxHp > prev.player.maxHp) {
        newPlayer.hp = Math.max(1, Math.floor(newPlayer.maxHp * hpRatio));
      } else {
        newPlayer.hp = Math.min(newPlayer.hp, newPlayer.maxHp);
      }
      
      // If max MP increased, scale current MP proportionally, otherwise cap at new max
      if (newPlayer.maxMp > prev.player.maxMp) {
        newPlayer.mp = Math.max(1, Math.floor(newPlayer.maxMp * mpRatio));
      } else {
        newPlayer.mp = Math.min(newPlayer.mp, newPlayer.maxMp);
      }

      const newState = {
        ...prev,
        player: newPlayer
      };
      
      saveGame(newState);
      return newState;
    });
  }, [gameState.player.inventory, setGameState, addBattleLogEntry, saveGame]);

  // Unequip item
  const unequipItem = useCallback((itemId: string) => {
    const equippedItem = gameState.player.inventory.find(eq => eq.id === itemId && eq.equipped);
    if (!equippedItem) {
      addBattleLogEntry({
        message: 'Item not found or not equipped!',
        type: 'system',
        timestamp: Date.now()
      });
      return;
    }

    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player };
      
      // Mark the item as unequipped in inventory
      newPlayer.inventory = newPlayer.inventory.map(eq => 
        eq.id === itemId ? { ...eq, equipped: false } : eq
      );
      
      // Recalculate stats based on equipped items
      const equippedItems = newPlayer.inventory.filter(eq => eq.equipped);
      
      // Reset stats to base values
      const baseCharacter = calculateStats({
        ...newPlayer,
        inventory: [], // Remove equipment for base calculation
        elements: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 },
        elementResistance: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 }
      });
      
      // Apply equipment bonuses
      newPlayer.pa = baseCharacter.pa;
      newPlayer.ma = baseCharacter.ma;
      newPlayer.pd = baseCharacter.pd;
      newPlayer.md = baseCharacter.md;
      newPlayer.maxHp = baseCharacter.maxHp;
      newPlayer.maxMp = baseCharacter.maxMp;
      newPlayer.elements = { ...baseCharacter.elements };
      newPlayer.elementResistance = { ...baseCharacter.elementResistance };
      
      equippedItems.forEach(eq => {
        if (eq.bonus.pa) newPlayer.pa += eq.bonus.pa;
        if (eq.bonus.ma) newPlayer.ma += eq.bonus.ma;
        if (eq.bonus.pd) newPlayer.pd += eq.bonus.pd;
        if (eq.bonus.md) newPlayer.md += eq.bonus.md;
        if (eq.bonus.maxHp) newPlayer.maxHp += eq.bonus.maxHp;
        if (eq.bonus.maxMp) newPlayer.maxMp += eq.bonus.maxMp;
        
        // Add elemental bonuses
        Object.entries(eq.elements).forEach(([element, value]) => {
          if (value && element in newPlayer.elements) {
            (newPlayer.elements as any)[element] += value;
          }
        });
        
        // Add elemental resistance (half of element values)
        Object.entries(eq.elements).forEach(([element, value]) => {
          if (value && element in newPlayer.elementResistance) {
            const resistanceValue = Math.floor(value / 2);
            newPlayer.elementResistance[element as keyof ElementResistance] += resistanceValue;
          }
        });
      });
      
      // Ensure current HP/MP don't exceed new max values, but also scale up if max increased
      const hpRatio = prev.player.hp / prev.player.maxHp;
      const mpRatio = prev.player.mp / prev.player.maxMp;
      
      // If max HP increased, scale current HP proportionally, otherwise cap at new max
      if (newPlayer.maxHp > prev.player.maxHp) {
        newPlayer.hp = Math.max(1, Math.floor(newPlayer.maxHp * hpRatio));
      } else {
        newPlayer.hp = Math.min(newPlayer.hp, newPlayer.maxHp);
      }
      
      // If max MP increased, scale current MP proportionally, otherwise cap at new max
      if (newPlayer.maxMp > prev.player.maxMp) {
        newPlayer.mp = Math.max(1, Math.floor(newPlayer.maxMp * mpRatio));
      } else {
        newPlayer.mp = Math.min(newPlayer.mp, newPlayer.maxMp);
      }

      const newState = {
        ...prev,
        player: newPlayer
      };
      
      // Explicit save after unequipping
      saveGame(newState);
      return newState;
    });
  }, [gameState.player.inventory, setGameState, addBattleLogEntry, saveGame]);

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
