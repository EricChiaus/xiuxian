import { describe, it, expect, vi } from 'vitest';
import { useShopInventory } from '../hooks/useShopInventory';
import { createInitialCharacter } from '../utils/character';
import { Equipment, ShopItem } from '../types/game';

// Mock basic game state
const createMockGameState = (overrides = {}) => ({
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
    }
  ],
  playerEquipment: {},
  ...overrides
});

const mockSetGameState = vi.fn();
const mockAddBattleLogEntry = vi.fn();

describe('useShopInventory - Basic Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAvailableShopItems', () => {
    it('should return shop items when no items owned', () => {
      const { getAvailableShopItems } = useShopInventory(
        createMockGameState(),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test_sword');
    });

    it('should filter out items in inventory', () => {
      const { getAvailableShopItems } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), inventory: ['test_sword'] }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(0);
    });

    it('should filter out equipped items', () => {
      const { getAvailableShopItems } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), equippedItems: { weapon: 'test_sword' } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      const result = getAvailableShopItems();
      expect(result).toHaveLength(0);
    });
  });

  describe('buyItem', () => {
    it('should call setGameState when buying item', () => {
      const { buyItem } = useShopInventory(
        createMockGameState(),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      buyItem('test_sword');

      expect(mockSetGameState).toHaveBeenCalledTimes(1);
      expect(mockAddBattleLogEntry).toHaveBeenCalledTimes(1);
    });

    it('should not call setGameState when item not found', () => {
      const { buyItem } = useShopInventory(
        createMockGameState({ shopItems: [] }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      buyItem('nonexistent_item');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });

    it('should not call setGameState when insufficient coins', () => {
      const { buyItem } = useShopInventory(
        createMockGameState({ player: { ...createInitialCharacter(), coin: 50 } }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      buyItem('test_sword');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });
  });

  describe('sellItem', () => {
    beforeEach(() => {
      // Add item to inventory for testing
      const item: Equipment = {
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
      };

      const { getAllEquipment } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), inventory: ['test_sword'], playerEquipment: { 'test_sword': item } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      // Mock getAllEquipment to return our test item
      vi.mocked(getAllEquipment).mockReturnValue([item]);
    });

    it('should call setGameState when selling item', () => {
      const { sellItem } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), inventory: ['test_sword'], playerEquipment: { 'test_sword': item } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      sellItem('test_sword');

      expect(mockSetGameState).toHaveBeenCalledTimes(1);
      expect(mockAddBattleLogEntry).toHaveBeenCalledTimes(1);
    });

    it('should not call setGameState when item not in inventory', () => {
      const { sellItem } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), inventory: [], playerEquipment: { 'test_sword': item } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      sellItem('test_sword');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });
  });

  describe('equipItem', () => {
    beforeEach(() => {
      // Add item to inventory for testing
      const item: Equipment = {
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
      };

      const { getAllEquipment } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), inventory: ['test_sword'], playerEquipment: { 'test_sword': item } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      // Mock getAllEquipment to return our test item
      vi.mocked(getAllEquipment).mockReturnValue([item]);
    });

    it('should call setGameState when equipping item', () => {
      const { equipItem } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), inventory: ['test_sword'], playerEquipment: { 'test_sword': item } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      equipItem('test_sword');

      expect(mockSetGameState).toHaveBeenCalledTimes(1);
      expect(mockAddBattleLogEntry).toHaveBeenCalledTimes(1);
    });

    it('should not call setGameState when item not in inventory', () => {
      const { equipItem } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), inventory: [], playerEquipment: { 'test_sword': item } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      equipItem('test_sword');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });
  });

  describe('unequipItem', () => {
    beforeEach(() => {
      // Equip item for testing
      const item: Equipment = {
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
      };

      const { getAllEquipment } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), equippedItems: { weapon: 'test_sword' }, playerEquipment: { 'test_sword': item } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      // Mock getAllEquipment to return our test item
      vi.mocked(getAllEquipment).mockReturnValue([item]);
    });

    it('should call setGameState when unequipping item', () => {
      const { unequipItem } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), equippedItems: { weapon: 'test_sword' }, playerEquipment: { 'test_sword': item } }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      unequipItem('weapon');

      expect(mockSetGameState).toHaveBeenCalledTimes(1);
      expect(mockAddBattleLogEntry).toHaveBeenCalledTimes(1);
    });

    it('should not call setGameState when no item equipped', () => {
      const { unequipItem } = useShopInventory(
        createMockGameState({
          player: { ...createInitialCharacter(), equippedItems: {} }
        }),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      unequipItem('weapon');

      expect(mockSetGameState).not.toHaveBeenCalled();
      expect(mockAddBattleLogEntry).not.toHaveBeenCalled();
    });
  });

  describe('refreshShop', () => {
    it('should call setGameState when refreshing shop', () => {
      const { refreshShop } = useShopInventory(
        createMockGameState(),
        mockSetGameState,
        mockAddBattleLogEntry
      );

      refreshShop();

      expect(mockSetGameState).toHaveBeenCalledTimes(1);
      expect(mockAddBattleLogEntry).toHaveBeenCalledTimes(1);
    });
  });
});
