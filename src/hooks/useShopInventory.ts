import { useCallback } from 'react';
import { BattleLogEntry, GameState, Equipment, Character } from '../types/game';
import { generateShopItems } from '../utils/shop';
import { generateRandomEquipment, calculateCharacterStats } from '../utils/equipment';

// Helper function to determine equipment type from ID
const getEquipmentTypeFromId = (itemId: string): keyof Character['equippedItems'] | null => {
  // This is a simplified version - in a real implementation, 
  // we'd look up the actual equipment data
  if (itemId.includes('equipment_')) {
    // For generated equipment, we'd need to look up the actual equipment data
    // For now, return null to let the calling function handle it
    return null;
  }
  
  if (itemId.includes('sword') || itemId.includes('staff')) {
    return 'weapon';
  }
  if (itemId.includes('armor')) {
    return 'armor';
  }
  if (itemId.includes('helmet')) {
    return 'helmet';
  }
  if (itemId.includes('boots')) {
    return 'boots';
  }
  if (itemId.includes('ring')) {
    return 'ring';
  }
  if (itemId.includes('necklace')) {
    return 'necklace';
  }
  if (itemId.includes('accessory')) {
    return 'accessory';
  }
  
  return null;
};

// Helper function to equip an item
const _equipItem = (character: Character, itemId: string): Character => {
  const equipmentType = getEquipmentTypeFromId(itemId);
  if (!equipmentType) return character;
  if (!character.inventory.includes(itemId)) return character;
  
  let newCharacter = { ...character };
  
  if (newCharacter.equippedItems[equipmentType]) {
    newCharacter.inventory = [...newCharacter.inventory, newCharacter.equippedItems[equipmentType]!];
  }
  
  newCharacter.equippedItems = {
    ...newCharacter.equippedItems,
    [equipmentType]: itemId
  };
  newCharacter.inventory = newCharacter.inventory.filter((id: string) => id !== itemId);
  
  return newCharacter;
};

// Helper function to unequip an item
const _unequipItem = (character: Character, slot: keyof Character['equippedItems']): Character => {
  const equippedItemId = character.equippedItems[slot];
  if (!equippedItemId) return character;
  
  let newCharacter = { ...character };
  newCharacter.inventory = [...newCharacter.inventory, equippedItemId];
  
  const newEquippedItems = { ...newCharacter.equippedItems };
  delete newEquippedItems[slot];
  newCharacter.equippedItems = newEquippedItems;
  
  return newCharacter;
};

export const useShopInventory = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  addBattleLogEntry: (entry: BattleLogEntry) => void
) => {
  // Generate all equipment data for inventory display
  const getAllEquipment = useCallback(() => {
    const allEquipment: Equipment[] = [];
    
    // Add shop items
    gameState.shopItems.forEach(shopItem => {
      if (shopItem.id.includes('equipment_')) {
        // Generate actual equipment data for dynamically generated items
        const level = parseInt(shopItem.description.match(/等级 (\d+)/)?.[1] || '1');
        const equipment = generateRandomEquipment(level);
        allEquipment.push({
          ...equipment,
          id: shopItem.id,
          name: shopItem.name,
          price: shopItem.price,
          sellPrice: Math.floor(shopItem.price / 2)
        });
      } else {
        // Legacy items - create basic equipment data
        const legacyEquipment = generateRandomEquipment(1);
        allEquipment.push({
          ...legacyEquipment,
          id: shopItem.id,
          name: shopItem.name,
          price: shopItem.price,
          sellPrice: Math.floor(shopItem.price / 2)
        });
      }
    });
    
    // Add equipped items
    Object.values(gameState.player.equippedItems).forEach(itemId => {
      if (itemId && !allEquipment.find(eq => eq.id === itemId)) {
        const equippedEquipment = generateRandomEquipment(gameState.player.level);
        allEquipment.push({
          ...equippedEquipment,
          id: itemId
        });
      }
    });
    
    return allEquipment;
  }, [gameState.shopItems, gameState.player.equippedItems, gameState.player.level]);

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
      message: `购买了 ${shopItem.name}，花费 ${shopItem.price} 🪙！`,
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.shopItems, gameState.player.coin, setGameState, addBattleLogEntry]);

  const sellItem = useCallback((itemId: string) => {
    if (!gameState.player.inventory.includes(itemId)) return;

    const allEquipment = getAllEquipment();
    const item = allEquipment.find(eq => eq.id === itemId);
    if (!item) return;

    const sellPrice = Math.floor(item.price / 2);
    
    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player, coin: prev.player.coin + sellPrice };
      newPlayer.inventory = newPlayer.inventory.filter((id: string) => id !== itemId);

      // Remove from equipped items if selling equipped item
      const equippedSlot = Object.keys(prev.player.equippedItems).find(
        slot => prev.player.equippedItems[slot as keyof typeof prev.player.equippedItems] === itemId
      ) as keyof typeof prev.player.equippedItems;
      
      if (equippedSlot) {
        const newEquippedItems = { ...newPlayer.equippedItems };
        delete newEquippedItems[equippedSlot];
        newPlayer.equippedItems = newEquippedItems;
      }

      return {
        ...prev,
        player: newPlayer
      };
    });

    addBattleLogEntry({
      message: `出售了 ${item.name}，获得 ${sellPrice} 🪙！`,
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.player.inventory, getAllEquipment, setGameState, addBattleLogEntry, gameState.player.equippedItems]);

  const equipItem = useCallback((itemId: string) => {
    if (!gameState.player.inventory.includes(itemId)) return;

    // Try to equip item
    const equipmentType = getEquipmentTypeFromId(itemId);
    if (!equipmentType) return;
    
    let newCharacter = { ...gameState.player };
    
    // If there's already an item equipped in this slot, add it back to inventory
    if (newCharacter.equippedItems[equipmentType]) {
      newCharacter.inventory = [...newCharacter.inventory, newCharacter.equippedItems[equipmentType]!];
    }
    
    // Equip new item and remove from inventory
    newCharacter.equippedItems = {
      ...newCharacter.equippedItems,
      [equipmentType]: itemId
    };
    newCharacter.inventory = newCharacter.inventory.filter(id => id !== itemId);
    
    // Recalculate stats with new equipment
    newCharacter = calculateCharacterStats(newCharacter, []);
    
    // Check if item was actually equipped (stats changed)
    const allEquipment = getAllEquipment();
    const item = allEquipment.find(eq => eq.id === itemId);
    const itemName = item?.name || itemId;
    
    if (JSON.stringify(newCharacter) !== JSON.stringify(gameState.player)) {
      addBattleLogEntry({
        message: `装备了 ${itemName}！`,
        type: 'system',
        timestamp: Date.now()
      });
      
      setGameState((prev: GameState) => ({
        ...prev,
        player: newCharacter
      }));
    }
  }, [gameState.player, addBattleLogEntry, setGameState, getAllEquipment]);

  const unequipItem = useCallback((slot: keyof GameState['player']['equippedItems']) => {
    const equippedItemId = gameState.player.equippedItems[slot];
    
    if (!equippedItemId) return;

    let newCharacter = { ...gameState.player };
    
    // Add equipped item back to inventory
    newCharacter.inventory = [...newCharacter.inventory, equippedItemId];
    
    // Remove from equipped items
    const newEquippedItems = { ...newCharacter.equippedItems };
    delete newEquippedItems[slot];
    newCharacter.equippedItems = newEquippedItems;
    
    // Recalculate stats without the unequipped item
    newCharacter = calculateCharacterStats(newCharacter, []);
    
    const allEquipment = getAllEquipment();
    const item = allEquipment.find(eq => eq.id === equippedItemId);
    const itemName = item?.name || equippedItemId;
    
    addBattleLogEntry({
      message: `卸下了 ${itemName}！`,
      type: 'system',
      timestamp: Date.now()
    });
    
    setGameState((prev: GameState) => ({
      ...prev,
      player: newCharacter
    }));
  }, [gameState.player, addBattleLogEntry, setGameState, getAllEquipment]);

  return {
    buyItem,
    sellItem,
    equipItem,
    unequipItem,
    refreshShop,
    getAllEquipment
  };
};
