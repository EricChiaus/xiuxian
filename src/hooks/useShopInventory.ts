import { useCallback } from 'react';
import { BattleLogEntry, GameState, Equipment, Character } from '../types/game';
import { generateShopItems } from '../utils/shop';
import { generateRandomEquipment, calculateCharacterStats, generateEquipment } from '../utils/equipment';
import { generateEquipment as generateShopEquipment } from '../utils/shop';

// Helper function to convert Chinese equipment names to English types
const getEquipmentTypeFromChineseName = (chineseName: string): Equipment['type'] => {
  const typeMap: { [key: string]: Equipment['type'] } = {
    '武器': 'weapon',
    '护甲': 'armor',
    '头盔': 'helmet',
    '靴子': 'boots',
    '戒指': 'ring',
    '项链': 'necklace',
    '饰品': 'accessory'
  };
  return typeMap[chineseName] || 'weapon';
};

export const useShopInventory = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  addBattleLogEntry: (entry: BattleLogEntry) => void
) => {
  // Generate all equipment data for inventory display
  const getAllEquipment = useCallback(() => {
    const allEquipment: Equipment[] = [];
    
    // Get equipment data from playerEquipment storage (preserves purchased items)
    Object.entries(gameState.playerEquipment || {}).forEach(([itemId, equipmentData]) => {
      allEquipment.push({
        ...equipmentData,
        id: itemId
      });
    });
    
    // Add shop items for display purposes (not in inventory)
    gameState.shopItems.forEach(shopItem => {
      if (!allEquipment.find(eq => eq.id === shopItem.id)) {
        if (shopItem.id.includes('equipment_')) {
          // Parse the actual equipment data from shop item description
          const level = parseInt(shopItem.description.match(/等级 (\d+)/)?.[1] || '1');
          const rarity = shopItem.description.match(/(普通|罕见|稀有|史诗|传奇)/)?.[1] as Equipment['rarity'] || 'common';
          const typeMatch = shopItem.description.match(/(武器|护甲|头盔|靴子|戒指|项链|饰品)/)?.[1];
          const type = typeMatch ? getEquipmentTypeFromChineseName(typeMatch) : 'weapon';
          
          // Generate equipment with proper stats based on the shop item data
          const equipment = generateEquipment(shopItem.id, type, level, rarity);
          
          allEquipment.push({
            ...equipment,
            id: shopItem.id,
            name: shopItem.name,
            price: shopItem.price,
            sellPrice: Math.floor(shopItem.price / 2)
          });
        } else {
          // Legacy items - use the actual equipment data from shop.ts
          const allLegacyEquipment = generateShopEquipment();
          const legacyEquipment = allLegacyEquipment.find((eq: Equipment) => eq.id === shopItem.id);
          if (legacyEquipment) {
            allEquipment.push(legacyEquipment);
          }
        }
      }
    });
    
    return allEquipment;
  }, [gameState.shopItems, gameState.playerEquipment, gameState.player.equippedItems, gameState.player.level]);

  // Helper function to determine equipment type from ID
  const getEquipmentTypeFromId = (itemId: string, allEquipment: Equipment[]): keyof Character['equippedItems'] | null => {
    // First try to find the equipment in the stored equipment data
    const equipment = allEquipment.find(eq => eq.id === itemId);
    if (equipment) {
      return equipment.type;
    }
    
    // Fallback to ID-based detection for legacy items
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

    // Generate the actual equipment data for this item (preserve it permanently)
    let purchasedEquipment: Equipment;
    if (shopItem.id.includes('equipment_')) {
      const level = parseInt(shopItem.description.match(/等级 (\d+)/)?.[1] || '1');
      purchasedEquipment = generateRandomEquipment(level);
    } else {
      purchasedEquipment = generateRandomEquipment(1);
    }

    setGameState((prev: GameState) => {
      const newPlayer = { ...prev.player, coin: prev.player.coin - shopItem.price };
      
      // Add equipment to inventory
      newPlayer.inventory = [...newPlayer.inventory, itemId];
      
      // Store the actual equipment data permanently
      newPlayer.playerEquipment = {
        ...newPlayer.playerEquipment,
        [itemId]: {
          ...purchasedEquipment,
          id: shopItem.id,
          name: shopItem.name,
          price: shopItem.price,
          sellPrice: Math.floor(shopItem.price / 2)
        }
      };

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

    const allEquipment = getAllEquipment();
    
    // Try to equip item
    const equipmentType = getEquipmentTypeFromId(itemId, allEquipment);
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
    newCharacter = calculateCharacterStats(newCharacter, allEquipment.filter(eq => Object.values(newCharacter.equippedItems).includes(eq.id)));
    
    // Check if item was actually equipped (stats changed)
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
