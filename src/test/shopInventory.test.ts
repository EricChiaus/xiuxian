import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useShopInventory } from '../hooks/useShopInventory';
import { createInitialCharacter } from '../utils/character';
import { generateShopItems } from '../utils/shop';
import { Equipment } from '../types/game';

// Mock data for testing
const mockGameState = {
  player: createInitialCharacter(),
  currentEnemy: null,
  enemies: [],
  selectedEnemyId: null,
  inBattle: false,
  isPlayerTurn: true,
  lastSaveTime: Date.now(),
  battleLog: [],
  offlineExp: 0,
  lastRegenerationTime: Date.now(),
  shopItems: [
    {
      id: 'test_sword',
      name: 'Test Sword',
      description: 'Test Sword (武器 - 等级 1)',
      price: 100,
      type: 'equipment',
      effect: '普通 | 物攻 +5'
    },
    {
      id: 'test_armor',
      name: 'Test Armor',
      description: 'Test Armor (护甲 - 等级 1)',
      price: 150,
      type: 'equipment',
      effect: '普通 | 物防 +3'
    }
  ],
  playerEquipment: {}
};

const mockSetGameState = vi.fn();
const mockAddBattleLogEntry = vi.fn();

describe('useShopInventory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllEquipment', () => {
    it('should return empty array when no equipment exists', () => {
      const { getAllEquipment } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAllEquipment();
      expect(result).toEqual([]);
    });

    it('should include equipment from playerEquipment storage', () => {
      const testEquipment: Equipment = {
        id: 'stored_item',
        name: 'Stored Item',
        type: 'weapon',
        rarity: 'common',
        level: 1,
        bonus: { pa: 10 },
        elements: {},
        elementResistance: {},
        price: 100,
        sellPrice: 50
      };

      const gameStateWithEquipment = {
        ...mockGameState,
        playerEquipment: { 'stored_item': testEquipment }
      };

      const { getAllEquipment } = useShopInventory(
        gameStateWithEquipment,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAllEquipment();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        ...testEquipment,
        id: 'stored_item'
      });
    });

    it('should include shop items that are not owned', () => {
      const { getAllEquipment } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAllEquipment();
      expect(result).toHaveLength(2); // Both shop items should be included
    });
  });

  describe('getAvailableShopItems', () => {
    it('should return all shop items when none are owned', () => {
      const { getAvailableShopItems } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(2);
      expect(result.map(item => item.id)).toEqual(['test_sword', 'test_armor']);
    });

    it('should filter out items in inventory', () => {
      const gameStateWithInventory = {
        ...mockGameState,
        player: {
          ...mockGameState.player,
          inventory: ['test_sword']
        }
      };

      const { getAvailableShopItems } = useShopInventory(
        gameStateWithInventory,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test_armor'); // Only armor should be available
    });

    it('should filter out equipped items', () => {
      const gameStateWithEquipped = {
        ...mockGameState,
        player: {
          ...mockGameState.player,
          equippedItems: { weapon: 'test_armor' }
        }
      };

      const { getAvailableShopItems } = useShopInventory(
        gameStateWithEquipped,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test_sword'); // Only sword should be available
    });

    it('should filter out items in both inventory and equipped', () => {
      const gameStateWithBoth = {
        ...mockGameState,
        player: {
          ...mockGameState.player,
          inventory: ['test_sword'],
          equippedItems: { weapon: 'test_armor' }
        }
      };

      const { getAvailableShopItems } = useShopInventory(
        gameStateWithBoth,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(0); // No items should be available
    });
  });

  describe('buyItem', () => {
    it('should buy item successfully when player has enough coins', () => {
      const { buyItem } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      buyItem('test_sword');

      expect(mockSetGameState).toHaveBeenCalledWith(expect.objectContaining({
        player: expect.objectContaining({
          coin: 0, // 100 - 100
          inventory: ['test_sword'],
          playerEquipment: {
            'test_sword': expect.any(Object) // Equipment data should be stored
          }
        })
      }));
      expect(mockAddBattleLogEntry).toHaveBeenCalledWith({
        message: '购买了 Test Sword，花费 100 🪙！',
        type: 'system',
        timestamp: expect.any(Number)
      });
    });

    it('should not buy item when player lacks coins', () => {
      const { buyItem } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      buyItem('test_sword');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });

    it('should not buy item when item does not exist', () => {
      const { buyItem } = useShopInventory(
        { ...mockGameState, shopItems: [] },
        mockSetGameState,
        mockAddBattleLogEntry
      );

      buyItem('nonexistent_item');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });
  });

  describe('sellItem', () => {
    beforeEach(() => {
      // Add item to inventory for testing
      mockGameState.player.inventory = ['test_sword'];
      mockGameState.player.playerEquipment = {
        'test_sword': {
          id: 'test_sword',
          name: 'Test Sword',
          type: 'weapon',
          rarity: 'common',
          level: 1,
          bonus: { pa: 10 },
          elements: {},
          elementResistance: {},
          price: 100,
          sellPrice: 50
        }
      };
    });

    it('should sell item successfully', () => {
      const { sellItem } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      sellItem('test_sword');

      expect(mockSetGameState).toHaveBeenCalledWith(expect.objectContaining({
        player: expect.objectContaining({
          coin: 150, // 100 + 50
          inventory: [], // Item removed from inventory
          playerEquipment: {} // Item removed from equipment storage
        })
      }));
      expect(mockAddBattleLogEntry).toHaveBeenCalledWith({
        message: '出售了 Test Sword，获得 50 🪙！',
        type: 'system',
        timestamp: expect.any(Number)
      });
    });

    it('should not sell item when item not in inventory', () => {
      const { sellItem } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      sellItem('nonexistent_item');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });
  });

  describe('equipItem', () => {
    beforeEach(() => {
      // Add item to inventory for testing
      mockGameState.player.inventory = ['test_sword'];
      mockGameState.player.playerEquipment = {
        'test_sword': {
          id: 'test_sword',
          name: 'Test Sword',
          type: 'weapon',
          rarity: 'common',
          level: 1,
          bonus: { pa: 10 },
          elements: {},
          elementResistance: {},
          price: 100,
          sellPrice: 50
        }
      };
    });

    it('should equip item successfully', () => {
      const { equipItem } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      equipItem('test_sword');

      expect(mockSetGameState).toHaveBeenCalledWith(expect.objectContaining({
        player: expect.objectContaining({
          inventory: [], // Item removed from inventory
          equippedItems: { weapon: 'test_sword' } // Item equipped
        })
      }));
      expect(mockAddBattleLogEntry).toHaveBeenCalledWith({
        message: '装备了 Test Sword！',
        type: 'system',
        timestamp: expect.any(Number)
      });
    });

    it('should not equip item when not in inventory', () => {
      const { equipItem } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      equipItem('nonexistent_item');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });
  });

  describe('unequipItem', () => {
    beforeEach(() => {
      // Equip item for testing
      mockGameState.player.equippedItems = { weapon: 'test_sword' };
      mockGameState.player.playerEquipment = {
        'test_sword': {
          id: 'test_sword',
          name: 'Test Sword',
          type: 'weapon',
          rarity: 'common',
          level: 1,
          bonus: { pa: 10 },
          elements: {},
          elementResistance: {},
          price: 100,
          sellPrice: 50
        }
      };
    });

    it('should unequip item successfully', () => {
      const { unequipItem } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      unequipItem('weapon');

      expect(mockSetGameState).toHaveBeenCalledWith(expect.objectContaining({
        player: expect.objectContaining({
          inventory: ['test_sword'], // Item returned to inventory
          equippedItems: {} // Item unequipped
        })
      }));
      expect(mockAddBattleLogEntry).toHaveBeenCalledWith({
        message: '卸下了 Test Sword！',
        type: 'system',
        timestamp: expect.any(Number)
      });
    });

    it('should not unequip when no item equipped', () => {
      const { unequipItem } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      unequipItem('weapon');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });
  });

  describe('refreshShop', () => {
    it('should refresh shop items', () => {
      const { refreshShop } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      refreshShop();

      expect(mockSetGameState).toHaveBeenCalledWith(expect.objectContaining({
        shopItems: expect.any(Array) // Should have new shop items
      }));
      expect(mockAddBattleLogEntry).toHaveBeenCalledWith({
        message: 'Shop inventory refreshed!',
        type: 'system',
        timestamp: expect.any(Number)
      });
    });
  });

  describe('Equipment Data Persistence', () => {
    it('should preserve equipment data across function calls', () => {
      const { getAllEquipment } = useShopInventory(
        mockGameState,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      // Call getAllEquipment multiple times
      const result1 = getAllEquipment();
      const result2 = getAllEquipment();
      const result3 = getAllEquipment();

      // Should return consistent data
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    it('should handle equipment type detection correctly', () => {
      const gameStateWithMixedEquipment = {
        ...mockGameState,
        playerEquipment: {
          'sword_item': {
            id: 'sword_item',
            name: 'Sword',
            type: 'weapon',
            rarity: 'rare',
            level: 3,
            bonus: { pa: 15 },
            elements: { fire: 5 },
            elementResistance: {},
            price: 200,
            sellPrice: 100
          }
        }
      };

      const { getAllEquipment } = useShopInventory(
        gameStateWithMixedEquipment,
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAllEquipment();
      const swordEquipment = result.find(eq => eq.id === 'sword_item');

      expect(swordEquipment).toBeDefined();
      expect(swordEquipment?.type).toBe('weapon');
      expect(swordEquipment?.rarity).toBe('rare');
      expect(swordEquipment?.level).toBe(3);
      expect(swordEquipment?.bonus.pa).toBe(15);
      expect(swordEquipment?.elements.fire).toBe(5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty shop items gracefully', () => {
      const { getAllEquipment, getAvailableShopItems } = useShopInventory(
        { ...mockGameState, shopItems: [] },
        mockSetGameState,
        mockAddBattleLogEntry
      );

      expect(getAllEquipment()).toEqual([]);
      expect(getAvailableShopItems()).toEqual([]);
    });

    it('should handle empty inventory gracefully', () => {
      const { getAllEquipment, getAvailableShopItems } = useShopInventory(
        { ...mockGameState, player: { ...mockGameState.player, inventory: [] } },
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(2); // All shop items should be available
    });

    it('should handle empty equipped items gracefully', () => {
      const { getAllEquipment, getAvailableShopItems } = useShopInventory(
        { ...mockGameState, player: { ...mockGameState.player, equippedItems: {} } },
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(2); // All shop items should be available
    });
  });
});
